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

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { error: "Variable name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      error:
        "Variable name must start with a letter or underscore and contains only letters, numbers, and underscores",
    }),
  endpoint: z.url({ error: "Please enter a valid URL" }),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(),
});

export type HttpRequestFormValues = z.infer<typeof formSchema>;

interface HttpRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: HttpRequestFormValues) => void;
  initialValues?: Partial<HttpRequestFormValues>;
}

const HttpRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialValues = {
    endpoint: "",
    method: "GET",
    body: "",
    variableName: "",
  },
}: HttpRequestDialogProps) => {
  const form = useForm<HttpRequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // reset form values when dialog opens with new initial values
  useEffect(() => {
    if (open) {
      form.reset(initialValues);
    }
  }, [open, initialValues, form]);

  const watchVariableName = form.watch("variableName") || "myApiCall";
  const watchMethod = form.watch("method");
  const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

  const handleSubmit = (values: HttpRequestFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>HTTP Request</DialogTitle>
          <DialogDescription>
            Configure settings for the HTTP Request node.
          </DialogDescription>
        </DialogHeader>
        <form
          id="form-http-request"
          className="space-y-8 mt-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FieldGroup className="gap-4">
            <Controller
              name="variableName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-http-request-endpoint-input">
                    Variable name
                  </FieldLabel>
                  <Input placeholder="myApiCall" {...field} />
                  <FieldDescription>
                    Use this name to reference the result in other nodes:{" "}
                    {`{{${watchVariableName}.httpResponse.data}}`}
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="method"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-http-request-select-method">
                    Method
                  </FieldLabel>
                  <Select
                    name={field.name}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger
                      id="form-http-request-select-method"
                      aria-invalid={fieldState.invalid}
                      className="w-full"
                    >
                      <SelectValue placeholder="Select a method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    The HTTP method to use for this request
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="endpoint"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-http-request-endpoint-input">
                    Endpoint URL
                  </FieldLabel>
                  <Input
                    placeholder="https://api.example.com/users/{{httpResponse.data.id}}"
                    {...field}
                  />
                  <FieldDescription>
                    Static URL or use {"{{variables}}"} for simple values or{" "}
                    {"{{json variables}}"} to stringify objects
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {showBodyField && (
              <Controller
                name="body"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-http-request-body-textarea">
                      Request Body
                    </FieldLabel>
                    <Textarea
                      className="min-h-[120px] font-mono text-sm"
                      placeholder={
                        '{\n  "userId": "{{httpResponse.data.id}}",\n  "name": "{{httpResponse.data.name}}",\n  "items": "{{httpResponse.data.items}}"\n}'
                      }
                      {...field}
                    />
                    <FieldDescription>
                      JSON with template variables. Use {"{{variables}}"} for
                      simple values or {"{{json variables}}"} to stringify
                      objects
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
          </FieldGroup>
        </form>
        <Field orientation="horizontal">
          <DialogFooter className="mt-4 w-full">
            <Button type="submit" form="form-http-request">
              Save
            </Button>
          </DialogFooter>
        </Field>
      </DialogContent>
    </Dialog>
  );
};

export { HttpRequestDialog };
