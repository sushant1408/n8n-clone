import { TRPCClientError } from "@trpc/client";
import { useState } from "react";

import { UpgradeDialog } from "@/components/upgrade-dialog";

const useUpgradeDialog = () => {
  const [open, setOpen] = useState(false);

  const handleError = (error: unknown) => {
    if (error instanceof TRPCClientError) {
      if (error.data?.code === "FORBIDDEN") {
        setOpen(true);
        return true;
      }
    }

    return false;
  };

  const dialog = <UpgradeDialog open={open} onOpenChange={setOpen} />;

  return {
    handleError,
    dialog,
  };
};

export { useUpgradeDialog };
