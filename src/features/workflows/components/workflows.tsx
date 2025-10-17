"use client";

import { useRouter } from "next/navigation";

import { EntityContainer, EntityHeader } from "@/components/entity-components";
import {
  useCreateWorkflow,
  useSuspenseWorkflows,
} from "@/features/workflows/hooks/use-workflows";
import { useUpgradeDialog } from "@/hooks/use-upgrade-dialog";

const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows();

  return (
    <div className="">
      <pre>
        <code>{JSON.stringify(workflows.data, null, 2)}</code>
      </pre>
    </div>
  );
};

const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
  const router = useRouter();

  const { mutate, isPending } = useCreateWorkflow();
  const { handleError, dialog } = useUpgradeDialog();

  const handleCreate = () => {
    mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => {
        handleError(error);
      },
    });
  };

  return (
    <>
      {dialog}
      <EntityHeader
        title="Workflows"
        description="Create  and manage your workflows"
        onNew={handleCreate}
        newButtonLabel="New workflow"
        disabled={disabled}
        isCreating={isPending}
      />
    </>
  );
};

const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<></>}
      pagination={<></>}
    >
      {children}
    </EntityContainer>
  );
};

export { WorkflowsContainer, WorkflowsHeader, WorkflowsList };
