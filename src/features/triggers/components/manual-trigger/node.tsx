import type { NodeProps } from "@xyflow/react";
import { memo } from "react";

import { BaseTriggerNode } from "@/features/triggers/components/base-trigger-node";
import { MousePointerIcon } from "lucide-react";

const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <>
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute workflow'"
        // status={}
        onSettings={() => {}}
        onDoubleClick={() => {}}
      />
    </>
  );
});
ManualTriggerNode.displayName = "ManualTriggerNode";

export { ManualTriggerNode };
