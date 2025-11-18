import { useQueryStates } from "nuqs";

import { credentialsParams } from "@/features/credentials/params";

const useCredentialsParams = () => {
  return useQueryStates(credentialsParams);
};

export { useCredentialsParams };
