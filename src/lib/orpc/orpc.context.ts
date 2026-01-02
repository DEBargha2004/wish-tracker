import { cookies, headers } from "next/headers";
import { db } from "../db";
import { parseCookie } from "../utils";

export type Context = {
  headers: Headers;
  cookies: Record<string, string>;
  db: typeof db;
};

export const createORPCContext = async ({
  request,
}: {
  request?: Request;
}): Promise<Context> => ({
  db: db,
  headers: request?.headers ?? (await headers()),
  cookies: request?.headers.get("cookie")
    ? parseCookie(request?.headers.get("cookie") ?? "")
    : Object.fromEntries(
        (await cookies()).getAll().map((c) => [c.name, c.value])
      ),
});
