import { generateSlug } from "random-word-slugs";
import z from "zod";

import prisma from "@/lib/db";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";

const workflowsRouter = createTRPCRouter({
  create: premiumProcedure.mutation(({ ctx }) => {
    // TODO: get name from user and remove "random-word-slugs"
    return prisma.workflow.create({
      data: {
        name: generateSlug(3),
        userId: ctx.auth.user.id,
      },
    });
  }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return prisma.workflow.delete({
        where: { userId: ctx.auth.user.id, id: input.id },
      });
    }),
  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return prisma.workflow.update({
        where: { userId: ctx.auth.user.id, id: input.id },
        data: { name: input.name },
      });
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return prisma.workflow.findUnique({
        where: { userId: ctx.auth.user.id, id: input.id },
      });
    }),
  getMany: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),
});

export { workflowsRouter };
