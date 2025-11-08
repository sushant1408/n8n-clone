"use client";

import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from "@xyflow/react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  MiniMap,
  Panel,
  ReactFlow,
} from "@xyflow/react";
import { useSetAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "@/features/editor/components/add-node-button";
import { editorAtom } from "@/features/editor/store/atoms";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { NodeType } from "@/generated/prisma";
import { EditorControls } from "./editor-controls";
import { ExecuteWorkflowButton } from "./execute-workflow-button";

import "@xyflow/react/dist/style.css";

const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data } = useSuspenseWorkflow(workflowId);

  const setEditor = useSetAtom(editorAtom);

  const [isEditorInteractive, setIsEditorInteractive] = useState(true);
  const [nodes, setNodes] = useState<Node[]>(data.nodes);
  const [edges, setEdges] = useState<Edge[]>(data.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      if (!isEditorInteractive) {
        return false;
      }

      // no self-connection
      if (connection.source === connection.target) {
        return false;
      }

      // only same TaskParam type connection
      const source = nodes.find((nd) => nd.id === connection.source);
      const target = nodes.find((nd) => nd.id === connection.target);

      if (!source || !target) {
        toast.error("Invalid connection: source or target node not found", {
          id: "node-not-found",
        });
        return false;
      }

      return true;
    },
    [nodes, isEditorInteractive]
  );

  const hasManualTrigger = useMemo(() => {
    return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
  }, [nodes]);

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeComponents}
        fitView
        snapToGrid
        snapGrid={[10, 10]}
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
        onInit={setEditor}
        nodesConnectable={isEditorInteractive}
        nodesDraggable={isEditorInteractive}
        edgesFocusable={isEditorInteractive}
        edgesReconnectable={isEditorInteractive}
        elementsSelectable={isEditorInteractive}
        isValidConnection={isValidConnection}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Panel position="bottom-left">
          <EditorControls
            isEditorInteractive={isEditorInteractive}
            setIsEditorInteractive={() => {
              setIsEditorInteractive((curr) => !curr);
            }}
          />
        </Panel>
        <MiniMap />
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
        {hasManualTrigger && (
          <Panel position="bottom-center">
            <ExecuteWorkflowButton workflowId={workflowId} />
          </Panel>
        )}
      </ReactFlow>
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
