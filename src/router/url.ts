import { base } from "@/lib/orpc/orpc";
import { authMiddleware } from "./middleware/auth.middleware";
import z from "zod";
import { getPresignedUrl } from "@/lib/aws";
import crypto from "crypto";

const eventUserAvatarUrlInput = z.object({
  mimetype: z.string(),
});

const eventUserAvatarDir = "images/events/avatars/";

export const getEventUserAvatarUrl = base
  .use(authMiddleware)
  .input(eventUserAvatarUrlInput)
  .handler(async ({ context, input }) => {
    const id = crypto.randomUUID();
    const key = eventUserAvatarDir + id;
    const url = await getPresignedUrl(key, input.mimetype);

    return {
      path: key,
      url,
    };
  });
