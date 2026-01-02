import "server-only";

import { router } from "@/router";
import { createRouterClient } from "@orpc/server";
import { createORPCContext } from "./orpc.context";

export const getServerClient = async () => {
  return createRouterClient(router, {
    context: createORPCContext({}),
  });
};
