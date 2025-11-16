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
  "claude-3-5-haiku-20241022",
  "claude-3-5-haiku-latest",
  "claude-3-7-sonnet-20250219",
  "claude-3-7-sonnet-latest",
  "claude-3-haiku-20240307",
  "claude-opus-4-0",
  "claude-opus-4-1",
  "claude-opus-4-1-20250805",
  "claude-opus-4-20250514",
  "claude-sonnet-4-0",
  "claude-sonnet-4-20250514",
  "claude-sonnet-4-5",
  "claude-sonnet-4-5-20250929",
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

export type AnthropicFormValues = z.infer<typeof formSchema>;

interface AnthropicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: AnthropicFormValues) => void;
  initialValues?: Partial<AnthropicFormValues>;
}

const AnthropicDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialValues = {
    model: AVAILABLE_MODELS[0],
    systemPrompt: "",
    userPrompt: "",
    variableName: "",
  },
}: AnthropicDialogProps) => {
  const form = useForm<AnthropicFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // reset form values when dialog opens with new initial values
  useEffect(() => {
    if (open) {
      form.reset(initialValues);
    }
  }, [open, initialValues, form]);

  const watchVariableName = form.watch("variableName") || "myAnthropic";

  const handleSubmit = (values: AnthropicFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anthropic Configuration</DialogTitle>
          <DialogDescription>
            Configure the AI model and prompts for this node.
          </DialogDescription>
        </DialogHeader>
        <form
          id="form-anthropic"
          className="space-y-8 mt-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FieldGroup className="gap-4">
            <Controller
              name="variableName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-anthropic-variable-name-input">
                    Variable name
                  </FieldLabel>
                  <Input placeholder="myAnthropic" {...field} />
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
                  <FieldLabel htmlFor="form-anthropic-select-model">
                    Model
                  </FieldLabel>
                  <Select
                    name={field.name}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger
                      id="form-anthropic-select-model"
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
                  <FieldLabel htmlFor="form-anthropic-system-prompt-textarea">
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
                  <FieldLabel htmlFor="form-anthropic-user-prompt-textarea">
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
            <Button type="submit" form="form-anthropic">
              Save
            </Button>
          </DialogFooter>
        </Field>
      </DialogContent>
    </Dialog>
  );
};

export { AnthropicDialog };
