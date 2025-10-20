"use client";

import { type ReactFlowState, useReactFlow, useStore } from "@xyflow/react";
import {
  LockKeyholeIcon,
  LockKeyholeOpenIcon,
  MaximizeIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

const EditorControls = ({
  isEditorInteractive,
  setIsEditorInteractive,
}: {
  isEditorInteractive: boolean;
  setIsEditorInteractive: () => void;
}) => {
  const { minZoomReached, maxZoomReached, unselectNodesAndEdges } = useStore(
    (state: ReactFlowState) => {
      return {
        minZoomReached: state.transform[2] <= state.minZoom,
        maxZoomReached: state.transform[2] >= state.maxZoom,
        unselectNodesAndEdges: state.unselectNodesAndEdges,
      };
    }
  );
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <ButtonGroup orientation="vertical" className="h-fit">
      <Button
        size="icon"
        variant="outline"
        className="bg-background"
        disabled={maxZoomReached}
        onClick={() => zoomIn()}
      >
        <ZoomInIcon />
      </Button>
      <Button
        size="icon"
        variant="outline"
        className="bg-background"
        disabled={minZoomReached}
        onClick={() => zoomOut()}
      >
        <ZoomOutIcon />
      </Button>
      <Button
        size="icon"
        variant="outline"
        className="bg-background"
        onClick={() => fitView()}
      >
        <MaximizeIcon />
      </Button>
      <Button
        size="icon"
        variant="outline"
        className="bg-background"
        onClick={() => {
          setIsEditorInteractive();
          unselectNodesAndEdges();
        }}
      >
        {isEditorInteractive ? <LockKeyholeOpenIcon /> : <LockKeyholeIcon />}
      </Button>
    </ButtonGroup>
  );
};

export { EditorControls };
