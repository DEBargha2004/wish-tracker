import { months } from "@/constants/months";
import { z } from "zod";

export const eventSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    avatar: z.string().optional(),
    phone: z
      .string()
      //   .length(10, { message: "Phone number must be exactly 10 digits" })
      .optional()
      .or(z.literal("")),
    whatsapp: z
      .string()
      //   .length(10, { message: "WhatsApp number must be exactly 10 digits" })
      .optional()
      .or(z.literal("")),
    month: z.string().refine(
      (val) => {
        return Number(val) >= 1 && Number(val) <= 12;
      },
      { message: "Month must be between 1 and 12" }
    ),
    day: z.string().refine(
      (val) => {
        return Number(val) >= 1 && Number(val) <= 31;
      },
      { message: "Day must be between 1 and 31" }
    ),
    description: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const month = Number(data.month);
    const day = Number(data.day);

    const monthObj = months.find((m) => m.id === month);
    const isValidDay = monthObj?.days.some((d) => day <= d);

    if (isValidDay) return;
    ctx.addIssue({
      code: "custom",
      message: "Invalid day for the selected month",
      path: ["day"],
    });
  });

export type TEventSchema = z.infer<typeof eventSchema>;

export const getEventDefaultValues = (): TEventSchema => ({
  name: "",
  avatar: "",
  phone: "",
  whatsapp: "",
  month: "",
  day: "",
  description: "",
});
