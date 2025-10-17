import { createLoader } from "nuqs/server";

import { workflowsParams } from "@/features/workflows/params";

const workflowsParamsLoader = createLoader(workflowsParams);

export { workflowsParamsLoader };
