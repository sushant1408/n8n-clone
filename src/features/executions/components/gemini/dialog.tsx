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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const AVAILABLE_MODELS = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-001",
  "gemini-1.5-flash-002",
  "gemini-1.5-flash-8b",
  "gemini-1.5-flash-8b-001",
  "gemini-1.5-flash-8b-latest",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro",
  "gemini-1.5-pro-001",
  "gemini-1.5-pro-002",
  "gemini-1.5-pro-latest",
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash-exp",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-live-001",
  "gemini-2.0-flash-thinking-exp-01-21",
  "gemini-2.0-pro-exp-02-05",
  "gemini-2.5-flash",
  "gemini-2.5-flash-image-preview",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash-lite-preview-09-2025",
  "gemini-2.5-flash-preview-04-17",
  "gemini-2.5-flash-preview-09-2025",
  "gemini-2.5-pro",
  "gemini-2.5-pro-exp-03-25",
] as const;

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { error: "Variable name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      error:
        "Variable name must start with a letter or underscore and contains only letters, numbers, and underscores",
    }),
  model: z.enum(AVAILABLE_MODELS),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, { error: "User prompt is required" }),
});

export type GeminiFormValues = z.infer<typeof formSchema>;

interface GeminiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: GeminiFormValues) => void;
  initialValues?: Partial<GeminiFormValues>;
}

const GeminiDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialValues = {
    model: AVAILABLE_MODELS[0],
    systemPrompt: "",
    userPrompt: "",
    variableName: "",
  },
}: GeminiDialogProps) => {
  const form = useForm<GeminiFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // reset form values when dialog opens with new initial values
  useEffect(() => {
    if (open) {
      form.reset(initialValues);
    }
  }, [open, initialValues, form]);

  const watchVariableName = form.watch("variableName") || "myGemini";

  const handleSubmit = (values: GeminiFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gemini Configuration</DialogTitle>
          <DialogDescription>
            Configure the AI model and prompts for this node.
          </DialogDescription>
        </DialogHeader>
        <form
          id="form-gemini"
          className="space-y-8 mt-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FieldGroup className="gap-4">
            <Controller
              name="variableName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-gemini-variable-name-input">
                    Variable name
                  </FieldLabel>
                  <Input placeholder="myGemini" {...field} />
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
              name="model"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-gemini-select-model">
                    Model
                  </FieldLabel>
                  <Select
                    name={field.name}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger
                      id="form-gemini-select-model"
                      aria-invalid={fieldState.invalid}
                      className="w-full"
                    >
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_MODELS.map((model) => (
                        <SelectItem value={model} key={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    The Google Gemini model to use for completion
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="systemPrompt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-gemini-system-prompt-textarea">
                    System Prompt (optional)
                  </FieldLabel>
                  <Textarea
                    className="min-h-[80px] font-mono text-sm"
                    placeholder="You are a helpful assistant"
                    {...field}
                  />
                  <FieldDescription>
                    Sets the behavior of the assistant. Use {"{{variables}}"}{" "}
                    for simple values or {"{{json variables}}"} to stringify
                    objects
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="userPrompt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-gemini-user-prompt-textarea">
                    User Prompt
                  </FieldLabel>
                  <Textarea
                    className="min-h-[120px] font-mono text-sm"
                    placeholder="Summarize this text: {{json httpResponse.data}}"
                    {...field}
                  />
                  <FieldDescription>
                    The prompt to send to the AI. Use {"{{variables}}"} for
                    simple values or {"{{json variables}}"} to stringify objects
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
            <Button type="submit" form="form-gemini">
              Save
            </Button>
          </DialogFooter>
        </Field>
      </DialogContent>
    </Dialog>
  );
};

export { GeminiDialog };
