import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseCookie(str: string) {
  return str
    .split(";")
    .map((it) => it.trim())
    .reduce<Record<string, string>>((acc, curr) => {
      const idx = curr.indexOf("=");
      if (idx === -1) return acc;

      acc[curr.slice(0, idx)] = decodeURIComponent(curr.slice(idx + 1));
      return acc;
    }, {});
}

export const dateFormatter = (
  date: string,
  options?: Intl.DateTimeFormatOptions
) => {
  const formatter = Intl.DateTimeFormat("en-US", options);
  return formatter.format(new Date(date));
};

export function getAcronym(text: string): string {
  return text
    .replace(/\/s+/g, " ")
    .trim()
    .split(" ")
    .map((it) => it[0].toUpperCase())
    .filter((_, idx, arr) => idx === 0 || idx === arr.length - 1)
    .join("");
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function buildImageUrl(path: string) {
  const cloudfront_url = `https://dhyydup1msl69.cloudfront.net`;

  return `${cloudfront_url}/${path}`;
}
