import { useQueryStates } from "nuqs";

import { executionsParams } from "@/features/workflow-executions/params";

const useExecutionsParams = () => {
  return useQueryStates(executionsParams);
};

export { useExecutionsParams };
