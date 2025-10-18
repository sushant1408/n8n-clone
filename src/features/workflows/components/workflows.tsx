"use client";

import { formatDistanceToNow } from "date-fns";
import { WorkflowIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflows,
} from "@/features/workflows/hooks/use-workflows";
import { useWorkflowsParams } from "@/features/workflows/hooks/use-workflows-params";
import type { Workflow } from "@/generated/prisma";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useUpgradeDialog } from "@/hooks/use-upgrade-dialog";

const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows();

  return (
    <EntityList
      items={workflows.data.items}
      getKey={(workflow) => workflow.id}
      emptyView={<WorkflowsEmpty />}
      renderItem={(workflow) => <WorkflowItem data={workflow} />}
    />
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

const WorkflowsLoading = () => {
  return <LoadingView message="Loading workflows..." />;
};

const WorkflowsError = () => {
  return <ErrorView message="Error loading workflows" />;
};

const WorkflowsEmpty = () => {
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
      <EmptyView
        message="You haven't created any workflows yet. Get started by creating your first workflow"
        onNew={handleCreate}
        isCreating={isPending}
        emptyButtonLabel="Add workflow"
        emptyTitle="No workflows"
      />
    </>
  );
};

const WorkflowItem = ({ data }: { data: Workflow }) => {
  const { mutate, isPending } = useRemoveWorkflow();

  const handleRemove = () => {
    mutate({ id: data.id });
  };

  return (
    <EntityItem
      href={`/workflows/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <WorkflowIcon className="size-5 text-muted-foreground" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={isPending}
    />
  );
};

export {
  WorkflowsContainer,
  WorkflowsEmpty,
  WorkflowsError,
  WorkflowsHeader,
  WorkflowsList,
  WorkflowsLoading,
  WorkflowsPagination,
  WorkflowsSearch,
};
