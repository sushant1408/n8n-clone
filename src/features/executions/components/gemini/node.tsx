"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";

import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { fetchGeminiRealtimeToken } from "@/features/executions/components/gemini/actions";
import {
  AVAILABLE_MODELS,
  GeminiDialog,
  type GeminiFormValues,
} from "@/features/executions/components/gemini/dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { GEMINI_CHANNEL_NAME } from "@/inngest/channels/gemini";

type GeminiNodeData = {
  variableName?: string;
  model?: (typeof AVAILABLE_MODELS)[number];
  systemPropmt?: string;
  userPrompt?: string;
};

type GeminiNodeType = Node<GeminiNodeData>;

const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `${nodeData.model || AVAILABLE_MODELS[0]}: ${nodeData.userPrompt.slice(
        0,
        50
      )}...`
    : "Not configured";

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: GEMINI_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchGeminiRealtimeToken,
  });

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: GeminiFormValues) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }

        return node;
      })
    );
  };

  return (
    <>
      <GeminiDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        initialValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/gemini.svg"
        name="Gemini"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});
GeminiNode.displayName = "GeminiNode";

export { GeminiNode };
