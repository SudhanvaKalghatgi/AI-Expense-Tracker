import mongoose from "mongoose";
import { Expense } from "../models/expense.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createExpenseService = async (clerkUserId, payload) => {
  const { amount, category, note, paymentMode, essentialType, date } = payload;

  const expense = await Expense.create({
    userId: clerkUserId,
    amount,
    category,
    note: note ?? "",
    paymentMode: paymentMode ?? "upi",
    essentialType: essentialType ?? "need",
    date: date ? new Date(date) : new Date(),
  });

  return expense;
};

export const getExpensesService = async (clerkUserId, query) => {
  const { month, year } = query;

  const filter = { userId: clerkUserId };

  // month & year filter
  if (month && year) {
    const m = Number(month);
    const y = Number(year);

    if (Number.isNaN(m) || Number.isNaN(y)) {
      throw new ApiError(400, "Month and year must be valid numbers");
    }

    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 1);
    filter.date = { $gte: start, $lt: end };
  }

  const expenses = await Expense.find(filter).sort({ date: -1 });
  return expenses;
};

export const updateExpenseService = async (clerkUserId, expenseId, payload) => {
  if (!mongoose.Types.ObjectId.isValid(expenseId)) {
    throw new ApiError(400, "Invalid expense id");
  }

  const expense = await Expense.findOne({ _id: expenseId, userId: clerkUserId });

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  // update only given fields
  Object.keys(payload).forEach((key) => {
    if (payload[key] !== undefined) {
      if (key === "date") expense[key] = new Date(payload[key]);
      else expense[key] = payload[key];
    }
  });

  await expense.save();
  return expense;
};

export const deleteExpenseService = async (clerkUserId, expenseId) => {
  if (!mongoose.Types.ObjectId.isValid(expenseId)) {
    throw new ApiError(400, "Invalid expense id");
  }

  const deleted = await Expense.findOneAndDelete({
    _id: expenseId,
    userId: clerkUserId,
  });

  if (!deleted) {
    throw new ApiError(404, "Expense not found");
  }

  return deleted;
};
