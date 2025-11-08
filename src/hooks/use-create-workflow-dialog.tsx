import { useState } from "react";

import { CreateWorkflowDialog } from "@/components/create-workflow-dialog";

const useCreateWorkflowDialog = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = (open: boolean) => {
    setOpen(open);
  };

  const dialog = <CreateWorkflowDialog open={open} onOpenChange={setOpen} />;

  return {
    handleOpen,
    dialog,
  };
};

export { useCreateWorkflowDialog };
