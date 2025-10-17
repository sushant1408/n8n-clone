import { useQueryStates } from "nuqs";

import { workflowsParams } from "@/features/workflows/params";

const useWorkflowsParams = () => {
  return useQueryStates(workflowsParams);
};

export { useWorkflowsParams };
