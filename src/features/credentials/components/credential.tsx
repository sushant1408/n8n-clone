"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
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
import { Spinner } from "@/components/ui/spinner";
import {
  useCreateCredential,
  useSuspenseCredential,
  useUpdateCredential,
} from "@/features/credentials/hooks/use-credentials";
import { type Credential, CredentialType } from "@/generated/prisma";
import { useUpgradeDialog } from "@/hooks/use-upgrade-dialog";

const formSchema = z.object({
  name: z.string().min(1, { error: "Name is required" }),
  type: z.enum(CredentialType),
  value: z.string().min(1, { error: "API key is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const credentialTypeOptions = [
  {
    value: CredentialType.ANTHROPIC,
    label: "Anthropic",
    icon: "/logos/anthropic.svg",
  },
  {
    value: CredentialType.GEMINI,
    label: "Gemini",
    icon: "/logos/gemini.svg",
  },
  {
    value: CredentialType.OPENAI,
    label: "OpenAI",
    icon: "/logos/openai.svg",
  },
];

interface CredentialFormProps {
  initialData?: {
    id?: Credential["id"];
    name: Credential["name"];
    type: CredentialType;
    value: Credential["value"];
  };
}

const CredentialForm = ({ initialData }: CredentialFormProps) => {
  const router = useRouter();

  const { mutateAsync: create, isPending: isCreating } = useCreateCredential();
  const { mutateAsync: update, isPending: isUpdating } = useUpdateCredential();

  const { handleError, dialog } = useUpgradeDialog();

  const isEdit = !!initialData?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      type: CredentialType.OPENAI,
      value: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (isEdit && initialData.id) {
      await update({
        id: initialData.id,
        ...values,
      });
    } else {
      await create(values, {
        onSuccess: (data) => {
          router.push(`/credentials/${data.id}`);
        },
        onError: (error) => {
          handleError(error);
        },
      });
    }
  };

  return (
    <>
      {dialog}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>
            {isEdit ? "Edit Credential" : "Create Credential"}
          </CardTitle>
          <CardDescription>
            {isEdit
              ? "Update your API key or credential details"
              : "Add a new API key or credential to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="credentials" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <FieldGroup className="gap-6">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-2">
                      <FieldLabel htmlFor="form-credentials-name-input">
                        Name
                      </FieldLabel>
                      <Input placeholder="My API key" {...field} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-2">
                      <FieldLabel htmlFor="form-credentials-type-select">
                        Type
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
                          {credentialTypeOptions.map((model) => (
                            <SelectItem value={model.value} key={model.value}>
                              <div className="flex items-center gap-2">
                                <Image
                                  src={model.icon}
                                  alt={model.label}
                                  width={16}
                                  height={16}
                                />
                                {model.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="value"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-2">
                      <FieldLabel htmlFor="form-credentials-value-input">
                        API key
                      </FieldLabel>
                      <Input type="password" placeholder="sk-..." {...field} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
              <div className="flex gap-4">
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {(isCreating || isUpdating) && <Spinner />}
                  {isEdit ? "Update" : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isCreating || isUpdating}
                  asChild
                >
                  <Link href="/credentials">Cancel</Link>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

const CredentialView = ({
  credentialId,
}: {
  credentialId: Credential["id"];
}) => {
  const { data } = useSuspenseCredential(credentialId);

  return <CredentialForm initialData={data} />;
};

export { CredentialForm, CredentialView };
