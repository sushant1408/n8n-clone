import Image from "next/image";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted flex min-h-svh flex-col justify-center items-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Image src="/logo.svg" alt="n8n-clone" width={30} height={30} />
          <span className="font-semibold text-sm">n8n clone</span>
        </Link>
        {children}
      </div>
    </div>
  );
};

export { AuthLayout };
