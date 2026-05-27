import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAppBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "http://localhost:3000";
}

export function getPublicFormUrl(formId: string) {
  return `${getAppBaseUrl()}/forms/${formId}`;
}

export function getQrCodeUrl(value: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(value)}`;
}

export function groupBy<T>(arr: T[], key: string) {
  return arr.reduce(
    (acc, item) => {
      const groupKey = String(item[key as keyof T]);
      const group = acc[groupKey] || (acc[groupKey] = []);
      group.push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}
