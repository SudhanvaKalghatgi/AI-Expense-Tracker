import { z } from "zod";

export const createExpenseSchema = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be greater than 0"),
    category: z.string().min(2, "Category is required"),
    note: z.string().max(200).optional(),

    paymentMode: z.enum(["upi", "cash", "card", "bank"]).optional(),
    essentialType: z.enum(["need", "want"]).optional(),

    date: z.string().optional(), // ISO string
  }),
});

export const updateExpenseSchema = z.object({
  body: z.object({
    amount: z.number().positive().optional(),
    category: z.string().min(2).optional(),
    note: z.string().max(200).optional(),

    paymentMode: z.enum(["upi", "cash", "card", "bank"]).optional(),
    essentialType: z.enum(["need", "want"]).optional(),

    date: z.string().optional(),
  }),
});

export const getExpensesQuerySchema = z.object({
  query: z.object({
    month: z.string().optional(),
    year: z.string().optional(),
  }),
});
