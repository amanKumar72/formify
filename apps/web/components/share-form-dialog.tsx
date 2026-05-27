"use client";

/* eslint-disable @next/next/no-img-element */

import { Copy, X } from "lucide-react";
import { toast } from "sonner";
import { getQrCodeUrl } from "~/lib/utils";

type ShareFormDialogProps = {
  open: boolean;
  link: string;
  onClose: () => void;
};

export const ShareFormDialog = ({ open, link, onClose }: ShareFormDialogProps) => {
  if (!open) {
    return null;
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(link);
    toast.success("Link copied", {
      position: "top-right",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md">
      <section className="w-full max-w-md rounded-xl border border-white/10 bg-surface-container-lowest p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-bold uppercase text-primary">Share Form</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-foreground">Public link</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-lg border border-white/10 text-on-surface-variant transition-colors hover:text-foreground"
            aria-label="Close share dialog"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-surface-container p-3">
          <p className="break-all font-mono text-xs text-foreground">{link}</p>
        </div>
        <div className="mx-auto mt-6 flex size-60 items-center justify-center rounded-lg bg-white p-4">
          <img src={getQrCodeUrl(link)} alt="QR code for public form link" className="size-full" />
        </div>
        <button
          type="button"
          onClick={copyLink}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-body text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Copy className="size-4" />
          Copy link
        </button>
      </section>
    </div>
  );
};
