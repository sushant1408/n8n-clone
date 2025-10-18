import {
  AlertTriangleIcon,
  MoreVerticalIcon,
  PackageOpenIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type EntityHeaderProps = {
  title: string;
  description?: string;
  newButtonLabel: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { onNew?: never; newButtonHref?: never }
);

function EntityHeader({
  title,
  description,
  newButtonLabel,
  disabled,
  isCreating,
  onNew,
  newButtonHref,
}: EntityHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
        {description && (
          <p className="text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {onNew && !newButtonHref && (
        <Button disabled={isCreating || disabled} size="sm" onClick={onNew}>
          {isCreating ? <Spinner /> : <PlusIcon />}
          {newButtonLabel}
        </Button>
      )}
      {newButtonHref && !onNew && (
        <Button size="sm" asChild>
          <Link href={newButtonHref} prefetch>
            <PlusIcon />
            {newButtonLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}

interface EntityContainerProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
}

function EntityContainer({
  children,
  header,
  search,
  pagination,
}: EntityContainerProps) {
  return (
    <div className="p-4 md:p-10 md:py-6 h-full">
      <div className="mx-auto max-w-screen-xl w-full flex flex-col gap-y-8 h-full">
        {header}
        <div className="flex flex-col gap-y-4 h-full">
          {search}
          {children}
        </div>
        {pagination}
      </div>
    </div>
  );
}

interface EntitySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function EntitySearch({
  value,
  onChange,
  placeholder = "Search...",
}: EntitySearchProps) {
  return (
    <div className="ml-auto">
      <InputGroup>
        <InputGroupInput
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

interface EntityPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

function EntityPagination({
  page,
  totalPages,
  onPageChange,
  disabled,
}: EntityPaginationProps) {
  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </div>
      <div className="flex items-center justify-end py-4">
        <ButtonGroup>
          <Button
            disabled={page === 1 || disabled}
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, page - 1))}
          >
            Previous
          </Button>
          <Button
            disabled={page === totalPages || totalPages === 0 || disabled}
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          >
            Next
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

interface StateViewProps {
  message?: string;
}

function LoadingView({ message }: StateViewProps) {
  return (
    <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
      <Spinner className="size-6 text-primary" />
      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}

function ErrorView({ message }: StateViewProps) {
  return (
    <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
      <AlertTriangleIcon className="size-6 text-muted-foreground" />
      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}

interface EmptyViewProps extends StateViewProps {
  onNew?: () => void;
  emptyTitle?: string;
  emptyButtonLabel?: string;
  disabled?: boolean;
  isCreating?: boolean;
}

function EmptyView({
  message,
  onNew,
  emptyTitle = "No items",
  emptyButtonLabel = "Add item",
  disabled,
  isCreating,
}: EmptyViewProps) {
  return (
    <Empty className="border border-dashed bg-white">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpenIcon />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyTitle>{emptyTitle}</EmptyTitle>
      {!!message && <EmptyDescription>{message}</EmptyDescription>}
      {!!onNew && (
        <EmptyContent>
          <Button onClick={onNew} disabled={isCreating || disabled}>
            {isCreating && <Spinner />}
            {emptyButtonLabel}
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}

interface EntityListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey?: (item: T, index: number) => string | number;
  emptyView?: React.ReactNode;
  className?: string;
}

function EntityList<T>({
  items,
  renderItem,
  getKey,
  emptyView,
  className,
}: EntityListProps<T>) {
  if (items.length === 0 && emptyView) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="max-w-sm mx-auto">{emptyView}</div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      {items.map((item, index) => (
        <div key={getKey ? getKey(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

interface EntityItemProps {
  href: string;
  title: string;
  subtitle?: React.ReactNode;
  image?: React.ReactNode;
  actions?: React.ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving?: boolean;
  className?: string;
}

function EntityItem({
  href,
  title,
  subtitle,
  image,
  actions,
  onRemove,
  isRemoving,
  className,
}: EntityItemProps) {
  const handleRemove = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (isRemoving) {
      return;
    }

    if (onRemove) {
      await onRemove();
    }
  };

  return (
    <Link href={href} prefetch>
      <Card
        className={cn(
          "p-4 shadow-none hover:shadow cursor-pointer",
          isRemoving && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <CardContent className="flex flex-row items-center justify-between p-0">
          <div className="flex items-center gap-3">
            {image}
            <div>
              <CardTitle className="text-base font-medium">{title}</CardTitle>
              {!!subtitle && (
                <CardDescription className="text-xs">
                  {subtitle}
                </CardDescription>
              )}
            </div>
          </div>

          {(actions || onRemove) && (
            <div className="flex gap-x-4 items-center">
              {actions}
              {onRemove && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVerticalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56"
                    align="end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenuItem
                      onClick={handleRemove}
                      variant="destructive"
                    >
                      <TrashIcon />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
};
