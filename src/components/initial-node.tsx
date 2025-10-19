"use client";

import type { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";

import { NodeSelector } from "@/components/node-selector";
import { PlaceholderNode } from "@/components/react-flow/placeholder-node";
import { WorkflowNode } from "@/components/workflow-node";

const InitialNode = memo((props: NodeProps) => {
  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <WorkflowNode showToolbar={false}>
        <PlaceholderNode onClick={() => setSelectorOpen(true)} {...props}>
          <div className="cursor-pointer flex items-center justify-center">
            <PlusIcon className="size-4" />
          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  );
});
InitialNode.displayName = "InitialNode";

export { InitialNode };
