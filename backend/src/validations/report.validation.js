import { z } from "zod";

const monthSchema = z
  .string()
  .regex(/^\d+$/, "Month must be a number")
  .transform(Number)
  .refine((m) => m >= 1 && m <= 12, "Month must be between 1 and 12");

const yearSchema = z
  .string()
  .regex(/^\d+$/, "Year must be a number")
  .transform(Number)
  .refine((y) => y >= 2000 && y <= 2100, "Year must be between 2000 and 2100");

export const monthlyReportQuerySchema = z.object({
  query: z.object({
    month: monthSchema,
    year: yearSchema,
  }),
});
