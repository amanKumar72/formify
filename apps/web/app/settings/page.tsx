"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { UserMenu } from "~/components/user-menu";
import { useUpdateProfileImage, useUser } from "~/hooks/api/auth";
import { fileToDataUrl } from "~/lib/file-upload";

const Settings = () => {
  const router = useRouter();
  const { user, isLoading, isError } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateProfileImageAsync, isPending: isUploadingProfileImage } = useUpdateProfileImage();

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

  const initials = user.fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleProfileImageChange = async (file: File | undefined) => {
    if (!file) {
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      await updateProfileImageAsync({
        dataUrl,
        filename: file.name,
      });
      toast.success("Profile image updated", {
        position: "top-right",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to update profile image";
      toast.error(message, {
        position: "top-right",
      });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

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
          <div className="flex items-center gap-5">
            <Avatar className="size-20">
              {user.profileImageUrl && (
                <AvatarImage src={user.profileImageUrl} alt={user.fullName} />
              )}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-heading text-lg font-bold">{user.fullName}</p>
              <p className="mt-1 text-on-surface-variant">{user.email}</p>
              <button
                type="button"
                disabled={isUploadingProfileImage}
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {isUploadingProfileImage ? "Uploading..." : "Upload profile image"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => void handleProfileImageChange(event.currentTarget.files?.[0])}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Settings;
