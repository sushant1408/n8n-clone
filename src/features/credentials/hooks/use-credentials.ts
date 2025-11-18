import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { useCredentialsParams } from "@/features/credentials/hooks/use-credentials-params";
import type { CredentialType } from "@/generated/prisma";
import { useTRPC } from "@/trpc/client";

/**
 * hook to fetch all credentials using suspense
 */
const useSuspenseCredentials = () => {
  const trpc = useTRPC();
  const [params] = useCredentialsParams();

  return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));
};

/**
 * hook to create a new credential
 */
const useCreateCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" created`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({})
        );
      },
      onError: (error) => {
        toast.error(`Failed to create credential: ${error.message}`);
      },
    })
  );
};

/**
 * hook to delete a credential
 */
const useRemoveCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" removed`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to delete the credential: ${error.message}`);
      },
    })
  );
};

/**
 * hook to fetch a single credential using suspense
 */
const useSuspenseCredential = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }));
};

/**
 * hook to update a credential
 */
const useUpdateCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" saved`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to save credential: ${error.message}`);
      },
    })
  );
};

/**
 * hook to fetch credentials by type
 */
const useGetCredentialsByType = (type: CredentialType) => {
  const trpc = useTRPC();

  return useQuery(
    trpc.credentials.getByType.queryOptions({
      type,
    })
  );
};

export {
  useCreateCredential,
  useGetCredentialsByType,
  useRemoveCredential,
  useSuspenseCredential,
  useSuspenseCredentials,
  useUpdateCredential,
};
