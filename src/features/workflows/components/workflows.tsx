"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow } from "date-fns";
import { WorkflowIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

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
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflows,
} from "@/features/workflows/hooks/use-workflows";
import { useWorkflowsParams } from "@/features/workflows/hooks/use-workflows-params";
import type { Workflow } from "@/generated/prisma";
import { useCreateWorkflowDialog } from "@/hooks/use-create-workflow-dialog";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useUpgradeDialog } from "@/hooks/use-upgrade-dialog";

const createWorkflowSchema = z.object({
  name: z.string().min(1, { error: "Workflow name is required" }),
});

export type CreateWorkflowFormValues = z.infer<typeof createWorkflowSchema>;

const CreateWorkflowForm = ({ onCancel }: { onCancel?: () => void }) => {
  const form = useForm<CreateWorkflowFormValues>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {
      name: "",
    },
  });

  const router = useRouter();

  const { mutate, isPending } = useCreateWorkflow();
  const { handleError, dialog } = useUpgradeDialog();

  const handleCreate = (values: CreateWorkflowFormValues) => {
    mutate(
      { name: values.name },
      {
        onSuccess: (data) => {
          router.push(`/workflows/${data.id}`);
          onCancel?.();
        },
        onError: (error) => {
          handleError(error);
        },
      }
    );
  };

  return (
    <>
      {dialog}
      <div className="space-y-4">
        <form id="create-workflow" onSubmit={form.handleSubmit(handleCreate)}>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldLabel htmlFor="create-workflow-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="create-workflow-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="AI Summarizer"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </form>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => onCancel?.()}
          >
            Cancel
          </Button>
          <Button type="submit" form="create-workflow" disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </>
  );
};

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
  const { handleOpen, dialog } = useCreateWorkflowDialog();

  return (
    <>
      {dialog}
      <EntityHeader
        title="Workflows"
        description="Create and manage your workflows"
        onNew={() => handleOpen(true)}
        newButtonLabel="New workflow"
        disabled={disabled}
        isCreating={false}
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
  const { handleOpen, dialog } = useCreateWorkflowDialog();

  return (
    <>
      {dialog}
      <EmptyView
        message="You haven't created any workflows yet. Get started by creating your first workflow"
        onNew={() => handleOpen(true)}
        isCreating={false}
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
  CreateWorkflowForm,
  WorkflowsContainer,
  WorkflowsEmpty,
  WorkflowsError,
  WorkflowsHeader,
  WorkflowsList,
  WorkflowsLoading,
  WorkflowsPagination,
  WorkflowsSearch,
};
