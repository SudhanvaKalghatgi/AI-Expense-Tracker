import { z } from "zod";

export const onboardProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email"),

    username: z
      .string()
      .min(3, "Username must be at least 3 chars")
      .max(20, "Username must be max 20 chars")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and _")
      .optional(),

    userType: z.enum(["student", "professional", "business"]),
    incomeTrackingMode: z.enum(["fixedIncome", "expensesOnly"]),

    monthlyIncome: z.number().positive().optional().nullable(),
    monthlyBudget: z.number().positive().optional().nullable(),
    savingTarget: z.number().positive().optional().nullable(),
  }),
});
