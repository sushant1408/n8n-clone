import type { ReactFlowInstance } from "@xyflow/react";
import { atom } from "jotai";

const editorAtom = atom<ReactFlowInstance | null>(null);

export { editorAtom };
