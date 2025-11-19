import { useSuspenseQuery } from "@tanstack/react-query";

import { useExecutionsParams } from "@/features/workflow-executions/hooks/use-workflow-executions-params";
import { useTRPC } from "@/trpc/client";

/**
 * hook to fetch all executions using suspense
 */
const useSuspenseExecutions = () => {
  const trpc = useTRPC();
  const [params] = useExecutionsParams();

  return useSuspenseQuery(trpc.executions.getMany.queryOptions(params));
};

/**
 * hook to fetch a single execution using suspense
 */
const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.executions.getOne.queryOptions({ id }));
};

export { useSuspenseExecution, useSuspenseExecutions };
