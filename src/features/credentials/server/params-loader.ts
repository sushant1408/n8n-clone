import { createLoader } from "nuqs/server";

import { credentialsParams } from "@/features/credentials/params";

const credentialsParamsLoader = createLoader(credentialsParams);

export { credentialsParamsLoader };
