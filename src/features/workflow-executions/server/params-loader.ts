import { createLoader } from "nuqs/server";

import { executionsParams } from "@/features/workflow-executions/params";

const executionsParamsLoader = createLoader(executionsParams);

export { executionsParamsLoader };
