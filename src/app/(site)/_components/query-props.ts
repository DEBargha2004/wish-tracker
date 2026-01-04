import { createLoader, parseAsString } from "nuqs/server";

export const params = {
  query: parseAsString.withDefault(""),
};

export const loadParams = createLoader(params);
