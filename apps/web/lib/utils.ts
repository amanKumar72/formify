import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function groupBy<T>(arr: T[], key: string) {
  return arr.reduce((acc, item) => {
    const groupKey = String(item[key as keyof T]);
    const group = acc[groupKey] || (acc[groupKey] = []);
    group.push(item);
    return acc;
  }, {} as Record<string, T[]>);
}
