"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserMenu } from "~/components/user-menu";
import { useUser } from "~/hooks/api/auth";

const Settings = () => {
  const router = useRouter();
  const { user, isLoading, isError } = useUser();

  useEffect(() => {
    if (!isLoading && (!user || isError)) {
      router.push("/signin");
    }
  }, [isError, isLoading, router, user]);

  if (isLoading || !user || isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background font-body text-on-surface-variant">
        Loading settings...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 font-body text-foreground md:px-8 lg:px-16">
      <header className="mx-auto flex max-w-[1200px] items-center justify-between">
        <Link href="/" className="font-heading text-2xl font-bold text-primary">
          FormFlow
        </Link>
        <UserMenu user={user} />
      </header>
      <section className="mx-auto mt-20 max-w-[1200px]">
        <p className="font-mono text-xs font-bold text-primary">SETTINGS</p>
        <h1 className="mt-3 font-heading text-5xl font-bold">Account settings</h1>
        <div className="mt-8 max-w-xl rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="font-heading text-lg font-bold">{user.fullName}</p>
          <p className="mt-1 text-on-surface-variant">{user.email}</p>
        </div>
      </section>
    </main>
  );
};

export default Settings;
