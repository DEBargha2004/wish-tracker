import { createUserEvent, userEventsByMonths } from "./event";
import { getEventUserAvatarUrl } from "./url";

export const router = {
  events: {
    userEventsByMonths,
    createUserEvent,
  },
  url: {
    generate: { getEventUserAvatarUrl },
  },
};
