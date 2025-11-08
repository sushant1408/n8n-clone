# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start: Common Commands

### Development
```bash
npm run dev                    # Start development server (port 3008)
npx prisma studio           # Open database UI (port 5555)
npx inngest-cli@latest dev  # Start Inngest event dev server (port 8288)
```

### Building & Testing
```bash
npm run build                # Build for production
npm start                    # Start production server
npm run lint                 # Run Biome linter
npm run format              # Auto-format code with Biome
```

### Database
```bash
npx prisma migrate dev      # Create and run database migration (after schema changes)
npx prisma db push         # Push schema changes to database
```

## Codebase Architecture Overview

This is a **Next.js 15 + TypeScript** full-stack application cloning n8n (workflow automation platform). The architecture emphasizes **end-to-end type safety**, **clear separation of concerns**, and **feature-based code organization**.

### Tech Stack Summary
- **Frontend**: React 19 + Next.js App Router
- **Styling**: Tailwind CSS 4 + Radix UI components
- **State Management**: React Query (server state) + Jotai (client state)
- **API**: tRPC 11 (type-safe, no manual routing)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Better-Auth + Polar (subscriptions)
- **Visual Editor**: Xyflow/React Flow
- **Async Jobs**: Inngest (event-driven orchestration)
- **AI Integration**: Vercel AI SDK (Google Gemini, OpenAI, Anthropic)
- **Linting**: Biome
- **URL State**: Nuqs (type-safe search params)

### Core Data Model (from Prisma)
```
User
  ├── Workflows (many)
  │    ├── Nodes (many) - positions, configuration, type (INITIAL, MANUAL_TRIGGER, HTTP_REQUEST)
  │    └── Connections (many) - directed edges between nodes
  ├── Credentials (future) - API keys for integrations
  └── Executions (future) - workflow run history
```

### Directory Structure

**`/src/app`** - Next.js App Router pages and layouts
- `(auth)/` - Login/signup pages
- `(dashboard)/(main)/` - Protected pages (workflows, executions, credentials)
- `(dashboard)/(editor)/` - Workflow editor pages
- `api/` - API routes (tRPC handler, authentication, Inngest webhooks)

**`/src/features`** - Feature modules (self-contained domains)
- `workflows/` - Create, list, update, delete workflows (core CRUD)
- `editor/` - Visual workflow editor with ReactFlow
- `triggers/` - Trigger node types (ManualTrigger, etc.)
- `executions/` - Execution node types (HttpRequest, etc.)
- `auth/` - Authentication components and layouts
- `subscriptions/` - Premium tier checks and Polar integration

**`/src/lib`** - Utility functions and configuration
- `auth.ts` - Better-Auth setup with Polar integration
- `auth-client.ts` - Client-side auth utilities
- `db.ts` - Prisma singleton
- `polar.ts` - Polar SDK client

**`/src/trpc`** - Type-safe API infrastructure
- `init.ts` - tRPC context, base/protected/premium procedures
- `client.tsx` - Client-side tRPC provider and hooks
- `server.tsx` - Server-side utilities (prefetch, hydration)
- `routers/` - Feature routers aggregated in `_app.ts`

**`/src/components`** - Shared UI components
- `ui/` - Radix UI + Tailwind component library
- `app-sidebar.tsx` - Main navigation
- `node-selector.tsx` - Dialog to add nodes to workflow
- `create-workflow-dialog.tsx` - Dialog to create new workflow

## Key Architectural Patterns

### 1. Feature-Based Organization
Each feature (workflows, editor, auth) contains:
- `components/` - UI components for that feature
- `hooks/` - Custom React hooks for data fetching/manipulation
- `server/` - tRPC routers and server utilities (prefetch, params parsing)
- `params.ts` - URL parameter type definitions
- `store/` - Jotai atoms for feature state (if needed)

**Example**: Adding a new workflow field
1. Update `/prisma/schema.prisma` (Workflow model)
2. Run `npx prisma migrate dev`
3. Update tRPC router in `/src/features/workflows/server/routers.ts`
4. Update TypeScript types automatically propagate through tRPC to UI

### 2. End-to-End Type Safety (tRPC)
All API types flow automatically from database → server → client:
```typescript
// Type inference chain: Prisma → tRPC procedure → React Query hook → UI
const workflowsRouter = router({
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Return type automatically inferred
      return prisma.workflow.create({ data: { ...input, userId: ctx.session.userId } });
    }),
});

// On client - all types inferred, no manual API typing needed
const { mutateAsync } = api.workflows.create.useMutation();
const data = await mutateAsync({ name: "My Workflow" }); // name is typed!
```

### 3. Server Components + Suspense for Performance
```typescript
// Layout (Server Component)
export default async function DashboardLayout() {
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<ErrorUI />}>
        <Suspense fallback={<LoadingUI />}>
          <WorkflowsList /> {/* Client Component */}
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

// Client Component
"use client";
const WorkflowsList = () => {
  const { data: workflows } = api.workflows.getMany.useSuspenseQuery();
  return workflows.map(...);
};
```
Benefits:
- Data fetched on server (faster initial load)
- State dehydrated and hydrated on client
- Client Query hook uses pre-fetched data
- Automatic cache invalidation on mutations

### 4. Three-Tier Authorization
```typescript
// Base: No authentication required
const baseProcedure = t.procedure;

// Protected: User must be authenticated
const protectedProcedure = baseProcedure.use(authMiddleware);

// Premium: User must have active Polar subscription
const premiumProcedure = protectedProcedure.use(premiumMiddleware);
```

### 5. Workflow as Visual Graph
- **Nodes**: Each has type (INITIAL, MANUAL_TRIGGER, HTTP_REQUEST), position, and configuration
- **Connections**: Directed edges with labeled input/output
- **Storage**: Nodes and Connections stored separately in Prisma, transformed to Xyflow format on frontend
- **Editing**: ReactFlow handles visual manipulation; mutations persist to database

### 6. State Management Stack
| State Type | Tool | Use Case |
|-----------|------|----------|
| Server data | React Query | Workflows, execution history, user data |
| Client UI | Jotai | Editor controls, modal open/close states |
| URL | Nuqs | Pagination, search filters, editor view state |

## Adding Features (Common Tasks)

### Adding a New API Endpoint
1. Create procedure in feature's `server/routers.ts`
2. Add to router aggregation in `/src/trpc/routers/_app.ts`
3. Use hook in component: `api.featureName.procedureName.useMutation/useQuery()`

### Adding a Node Type to Workflow Editor
1. Create component in `/src/features/[trigger|executions]/components/[NodeName].tsx`
2. Add to node registry in `/src/config/node-components.ts`
3. Update node selector to show option in `/src/components/node-selector.tsx`
4. Handle node configuration (optional) with a dialog component

### Creating a Protected Page
1. Page lives in `(dashboard)/` layout (automatically protected)
2. Fetch data on server using `trpc.caller.procedures()`
3. Pass hydrated data to client component
4. Use `api.procedure.useSuspenseQuery()` in client component

### Adding a Database Model
1. Add model to `/prisma/schema.prisma`
2. Run `npx prisma migrate dev` (give it a descriptive name)
3. Prisma client automatically regenerated
4. Create tRPC router in feature's `server/routers.ts`

## Important Files & Concepts

### Database & ORM
- `/prisma/schema.prisma` - All data models (User, Workflow, Node, Connection, etc.)
- `/src/lib/db.ts` - Prisma singleton for queries
- Migrations auto-created with `npx prisma migrate dev`

### API & Type Safety
- `/src/trpc/init.ts` - tRPC router setup, context definition, procedure hierarchy
- `/src/trpc/routers/_app.ts` - Main router aggregating all feature routers
- `/src/features/[feature]/server/routers.ts` - Feature-specific API procedures
- **Key**: All mutations/queries are type-safe end-to-end via tRPC

### Authentication & Authorization
- `/src/lib/auth.ts` - Better-Auth configuration
- `/src/lib/auth-client.ts` - Client-side auth utilities
- Better-Auth automatically creates Polar customer on signup
- Check session in tRPC context: `ctx.session?.user.id`

### UI Components
- `/src/components/ui/` - Radix UI primitives (Button, Dialog, Input, etc.)
- `/src/components/app-sidebar.tsx` - Main navigation
- All Tailwind-styled, fully accessible

### Visual Editor
- `/src/features/editor/components/editor.tsx` - Main ReactFlow editor
- `/src/config/node-components.ts` - Node type registry
- Nodes stored in database, synced with editor on load/save

### Event-Driven Workflows (Inngest)
- `/src/inngest/client.ts` - Inngest client setup
- `/src/inngest/functions.ts` - Workflow execution logic
- Currently has demo function calling Google Gemini
- Future: Execute full user workflows asynchronously with step-based durability

## Code Style & Conventions

- **Component naming**: PascalCase (e.g., `WorkflowEditor.tsx`)
- **Hook naming**: camelCase with `use` prefix (e.g., `useWorkflows()`)
- **Server vs Client**: Mark client components with `"use client"` directive
- **Styling**: Tailwind utility classes + Radix components, avoid inline styles
- **Type Safety**: Zod for validation, TypeScript strict mode enabled
- **Formatting**: Biome enforces consistent code style (run `npm run format`)

## Debugging & Development Tips

- **Type Errors**: tRPC types flow from Prisma → server → client. Fix schema if types don't match.
- **Data Not Showing**: Check React Query cache in browser DevTools (search for `@tanstack/query`)
- **Auth Issues**: Verify session exists via `auth-client.ts` and check Prisma studio for user
- **Editor Issues**: React Flow logs are in browser console; check node positions/types in database
- **Inngest Events**: View queued/executed jobs at `http://localhost:8288` while dev server running
- **Database Issues**: Use `npx prisma studio` to inspect/modify data directly

## Project Evolution & Known Patterns

This project is in **active development** with clear architectural patterns established:
- ✅ User authentication and authorization layer
- ✅ Core workflow CRUD operations
- ✅ Visual editor with nodes and connections
- ✅ Subscription tier support (Polar integration)
- ⏳ Node execution logic (triggers, HTTP requests, AI actions)
- ⏳ Workflow run history and logging
- ⏳ Advanced features (scheduling, webhooks, credentials management)

The architecture is designed to scale with these additions without major restructuring. New features follow the established patterns: feature module → tRPC router → React Query hook → UI component.
