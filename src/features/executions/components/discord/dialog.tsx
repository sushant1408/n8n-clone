"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { error: "Variable name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      error:
        "Variable name must start with a letter or underscore and contains only letters, numbers, and underscores",
    }),
  username: z.string().optional(),
  content: z
    .string()
    .min(1, { error: "Message content is required" })
    .max(2000, { error: "Discord message cannot exceed 2000 characters" }),
  webhookUrl: z.string().min(1, { error: "Webhook URL is required" }),
});

export type DiscordFormValues = z.infer<typeof formSchema>;

interface DiscordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: DiscordFormValues) => void;
  initialValues?: Partial<DiscordFormValues>;
}

const DiscrdDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialValues = {
    variableName: "",
    username: "",
    content: "",
    webhookUrl: "",
  },
}: DiscordDialogProps) => {
  const form = useForm<DiscordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // reset form values when dialog opens with new initial values
  useEffect(() => {
    if (open) {
      form.reset(initialValues);
    }
  }, [open, initialValues, form]);

  const watchVariableName = form.watch("variableName") || "myDiscord";

  const handleSubmit = (values: DiscordFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Discord Configuration</DialogTitle>
          <DialogDescription>
            Configure the Discord webhook settings for this node.
          </DialogDescription>
        </DialogHeader>
        <form
          id="form-discord"
          className="space-y-8 mt-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FieldGroup className="gap-4">
            <Controller
              name="variableName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-discord-variable-name-input">
                    Variable name
                  </FieldLabel>
                  <Input placeholder="myDiscord" {...field} />
                  <FieldDescription>
                    Use this name to reference the result in other nodes:{" "}
                    {`{{${watchVariableName}.aiResponse}}`}
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="webhookUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-discord-webhook-url-input">
                    Webhook URL
                  </FieldLabel>
                  <Input
                    placeholder="https://discord.com/api/webhook/..."
                    {...field}
                  />
                  <FieldDescription>
                    Get this from Discord: Channel Settings -&gt; Integrations
                    -&gt; Webhooks
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-discord-content-input">
                    Message Content
                  </FieldLabel>
                  <Textarea
                    placeholder="Summary: {{myGemini.aiResponse}}"
                    {...field}
                  />
                  <FieldDescription>
                    The message to send. Use {"{{variables}}"} for simple values
                    or {"{{json variables}}"} to stringify objects
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-discord-username-input">
                    Bot Username (optional)
                  </FieldLabel>
                  <Input placeholder="Workflow Bot" {...field} />
                  <FieldDescription>
                    Override the webhook&apos;s default username
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <Field orientation="horizontal">
          <DialogFooter className="mt-4 w-full">
            <Button type="submit" form="form-discord">
              Save
            </Button>
          </DialogFooter>
        </Field>
      </DialogContent>
    </Dialog>
  );
};

export { DiscrdDialog };
