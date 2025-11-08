import { FlaskConicalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";

const ExecuteWorkflowButton = ({ workflowId }: { workflowId: string }) => {
  const { mutate, isPending } = useExecuteWorkflow();

  const handleExecute = () => {
    mutate({ id: workflowId });
  };

  return (
    <Button size="lg" onClick={handleExecute} disabled={isPending}>
      {isPending ? <Spinner /> : <FlaskConicalIcon />}
      Execute workflow
    </Button>
  );
};

export { ExecuteWorkflowButton };
