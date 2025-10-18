"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";

const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data } = useSuspenseWorkflow(workflowId);

  return (
    <div>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
};

const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};

const EditorError = () => {
  return <ErrorView message="Error loading editor" />;
};

export { Editor, EditorError, EditorLoading };
