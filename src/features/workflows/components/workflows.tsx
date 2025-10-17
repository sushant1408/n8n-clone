"use client";

import { useRouter } from "next/navigation";

import {
  EntityContainer,
  EntityHeader,
  EntityPagination,
  EntitySearch,
} from "@/components/entity-components";
import {
  useCreateWorkflow,
  useSuspenseWorkflows,
} from "@/features/workflows/hooks/use-workflows";
import { useWorkflowsParams } from "@/features/workflows/hooks/use-workflows-params";
import { useUpgradeDialog } from "@/hooks/use-upgrade-dialog";
import { useEntitySearch } from "@/hooks/use-entity-search";

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

const WorkflowsSearch = () => {
  const [params, setParams] = useWorkflowsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search workflows..."
    />
  );
};

const WorkflowsPagination = () => {
  const workflows = useSuspenseWorkflows();
  const [params, setParams] = useWorkflowsParams();

  return (
    <EntityPagination
      disabled={workflows.isFetching}
      totalPages={workflows.data.totalPages}
      page={workflows.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export {
  WorkflowsContainer,
  WorkflowsHeader,
  WorkflowsList,
  WorkflowsPagination,
  WorkflowsSearch,
};
