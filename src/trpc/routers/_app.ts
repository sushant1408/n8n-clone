import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const appRouter = createTRPCRouter({
  tastAi: protectedProcedure.mutation(async () => {
    await inngest.send({ name: "execute/ai" });

    return { success: true, message: "job queued" };
  }),
  getUsers: protectedProcedure.query(({ ctx }) => {
    return prisma.user.findMany();
  }),
  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(() => {
    return prisma.workflow.create({ data: { name: "wf-1" } });
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
