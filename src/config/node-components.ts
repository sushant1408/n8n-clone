import type { NodeTypes } from "@xyflow/react";

import { InitialNode } from "@/components/initial-node";
import { NodeType } from "@/generated/prisma";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
} as const satisfies NodeTypes;

export type RegisterNodeType = keyof typeof nodeComponents;
