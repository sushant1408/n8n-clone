"use client";

import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "@/features/credentials/hooks/use-credentials";
import { useCredentialsParams } from "@/features/credentials/hooks/use-credentials-params";
import { type Credential, CredentialType } from "@/generated/prisma";
import { useEntitySearch } from "@/hooks/use-entity-search";

const CredentialsList = () => {
  const credentials = useSuspenseCredentials();

  return (
    <EntityList
      items={credentials.data.items}
      getKey={(credential) => credential.id}
      emptyView={<CredentialsEmpty />}
      renderItem={(credential) => <CredentialItem data={credential} />}
    />
  );
};

const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <EntityHeader
      title="Credentials"
      description="Create and manage your credentials"
      newButtonLabel="New credential"
      newButtonHref="/credentials/new"
      disabled={disabled}
    />
  );
};

const CredentialsSearch = () => {
  const [params, setParams] = useCredentialsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search credentials..."
    />
  );
};

const CredentialsPagination = () => {
  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialsParams();

  return (
    <EntityPagination
      disabled={credentials.isFetching}
      totalPages={credentials.data.totalPages}
      page={credentials.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

const CredentialsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <EntityContainer
      header={<CredentialsHeader />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

const CredentialsLoading = () => {
  return <LoadingView message="Loading credentials..." />;
};

const CredentialsError = () => {
  return <ErrorView message="Error loading credentials" />;
};

const CredentialsEmpty = () => {
  const router = useRouter();

  const handleCreate = () => {
    router.push("/credentials/new");
  };

  return (
    <EmptyView
      message="You haven't created any credentials yet. Get started by creating your first credential"
      onNew={handleCreate}
      isCreating={false}
      emptyButtonLabel="Add credential"
      emptyTitle="No credentials"
    />
  );
};

const credentialLogos: Record<CredentialType, string> = {
  [CredentialType.ANTHROPIC]: "/logos/anthropic.svg",
  [CredentialType.GEMINI]: "/logos/gemini.svg",
  [CredentialType.OPENAI]: "/logos/openai.svg",
};

const CredentialItem = ({ data }: { data: Credential }) => {
  const { mutate, isPending } = useRemoveCredential();

  const handleRemove = () => {
    mutate({ id: data.id });
  };

  return (
    <EntityItem
      href={`/credentials/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <Image
            src={credentialLogos[data.type]}
            alt={data.name}
            height={20}
            width={20}
          />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={isPending}
    />
  );
};

export {
  CredentialsContainer,
  CredentialsEmpty,
  CredentialsError,
  CredentialsHeader,
  CredentialsList,
  CredentialsLoading,
  CredentialsPagination,
  CredentialsSearch,
};
