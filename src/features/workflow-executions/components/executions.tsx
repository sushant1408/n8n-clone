"use client";

import { formatDistanceToNow } from "date-fns";
import { CheckCircle2Icon, ClockIcon, XCircleIcon } from "lucide-react";

import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { Spinner } from "@/components/ui/spinner";
import { useSuspenseExecutions } from "@/features/workflow-executions/hooks/use-workflow-executions";
import { useExecutionsParams } from "@/features/workflow-executions/hooks/use-workflow-executions-params";
import {
  type Execution,
  ExecutionStatus,
  type Workflow,
} from "@/generated/prisma";

const ExecutionsList = () => {
  const executions = useSuspenseExecutions();

  return (
    <EntityList
      items={executions.data.items}
      getKey={(executions) => executions.id}
      emptyView={<ExecutionsEmpty />}
      renderItem={(executions) => <ExecutionsItem data={executions} />}
    />
  );
};

const ExecutionsHeader = () => {
  return (
    <EntityHeader
      title="Executions"
      description="View your workflow execution history"
      newButtonLabel=""
    />
  );
};

const ExecutionsPagination = () => {
  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionsParams();

  return (
    <EntityPagination
      disabled={executions.isFetching}
      totalPages={executions.data.totalPages}
      page={executions.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

const ExecutionsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <EntityContainer
      header={<ExecutionsHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

const ExecutionsLoading = () => {
  return <LoadingView message="Loading executions..." />;
};

const ExecutionsError = () => {
  return <ErrorView message="Error loading credentials" />;
};

const ExecutionsEmpty = () => {
  return (
    <EmptyView
      emptyTitle="No executions"
      message="You don't any executions yet. Get started by running your first workflow"
    />
  );
};

const getStatusIcon = (status: Execution["status"]) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-5 text-green-600" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-red-600" />;
    case ExecutionStatus.RUNNING:
      return <Spinner className="size-5 text-blue-600" />;
    default:
      return <ClockIcon className="size-5 text-muted-foreground" />;
  }
};

const formatStatus = (status: Execution["status"]) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
};

const ExecutionsItem = ({
  data,
}: {
  data: Execution & {
    workflow: {
      id: Workflow["id"];
      name: Workflow["name"];
    };
  };
}) => {
  const duration = data.completedAt
    ? Math.round(
        new Date(data.completedAt).getTime() -
          new Date(data.startedAt).getTime()
      ) / 1000
    : null;

  const subtitle = (
    <>
      {data.workflow.name} &bull; Started{" "}
      {formatDistanceToNow(data.startedAt, { addSuffix: true })}
      {duration !== null && <>&bull; Took {duration}s</>}
    </>
  );

  return (
    <EntityItem
      href={`/executions/${data.id}`}
      title={formatStatus(data.status)}
      subtitle={subtitle}
      image={
        <div className="size-8 flex items-center justify-center">
          {getStatusIcon(data.status)}
        </div>
      }
    />
  );
};

export {
  ExecutionsContainer,
  ExecutionsEmpty,
  ExecutionsError,
  ExecutionsHeader,
  ExecutionsList,
  ExecutionsLoading,
  ExecutionsPagination,
};
