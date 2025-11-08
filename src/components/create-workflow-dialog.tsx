"use client";

import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateWorkflowForm } from "@/features/workflows/components/workflows";

const createWorkflowSchema = z.object({
  name: z.string().min(1, { error: "Workflow name is required" }),
});

export type CreateWorkflowFormValues = z.infer<typeof createWorkflowSchema>;

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateWorkflowDialog = ({ open, onOpenChange }: UpgradeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a workflow</DialogTitle>
          <DialogDescription>
            Let&apos;s start with a name for your workflow
          </DialogDescription>
        </DialogHeader>
        <CreateWorkflowForm onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export { CreateWorkflowDialog };
