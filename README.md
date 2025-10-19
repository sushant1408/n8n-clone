This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

1. First, run the development server:

    ```bash
    npm run dev
    ```

    Open [http://localhost:3008](http://localhost:3008) with your browser to see the result.

2. Then run the prisma studio:

    ```bash
    npx prisma studio
    ```

    Open [http://localhost:5555](http://localhost:5555) with your browser to see the prisma studio.

3. Then start the inngest dev server:

    ```bash
    npx inngest-cli@latest dev
    ```

    Open [http://localhost:8288](http://localhost:8288) with your browser to see the inngest result.

## Making Changes

- You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

- Run migration after making changes in prisma schema:

    ```bash
    npx prisma migrate dev
    ```

    and if prompted, give the migration a name. Restart the development server and prisma studio after each migration to see the changes without any unexpected errors.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
