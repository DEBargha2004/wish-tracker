import { cookies, headers } from "next/headers";
import { db } from "../db";
import { parseCookie } from "../utils";
import { auth, Auth } from "../auth";

export type Context = {
  headers: Headers;
  cookies: Record<string, string>;
  db: typeof db;
  auth: Auth;
};

export const createORPCContext = async ({
  request,
}: {
  request?: Request;
}): Promise<Context> => {
  return {
    db: db,
    auth: auth,
    headers: request?.headers ?? (await headers()),
    cookies: request?.headers.get("cookie")
      ? parseCookie(request?.headers.get("cookie") ?? "")
      : Object.fromEntries(
          (await cookies()).getAll().map((c) => [c.name, c.value])
        ),
  };
};
