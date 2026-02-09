import mongoose from "mongoose";
import { Expense } from "../models/expense.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createExpenseService = async (clerkUserId, payload) => {
  const { amount, category, note, paymentMode, essentialType, date } = payload;

  // ✅ Validate date
  const finalDate = date ? new Date(date) : new Date();

  if (isNaN(finalDate.getTime())) {
    throw new ApiError(400, "Invalid date format");
  }

  const expense = await Expense.create({
    userId: clerkUserId,
    amount,
    category,
    note: note ?? "",
    paymentMode: paymentMode ?? "upi",
    essentialType: essentialType ?? "need",
    date: finalDate,
  });

  return expense;
};


export const getExpensesService = async (clerkUserId, query) => {
  const { month, year, page = 1, limit = 10 } = query;

  const filter = { userId: clerkUserId };

  // --------------------
  // Month & year filter
  // --------------------
  if (month && year) {
    const m = Number(month);
    const y = Number(year);

    if (isNaN(m) || m < 1 || m > 12) {
      throw new ApiError(400, "Month must be between 1 and 12");
    }

    if (isNaN(y) || y < 2000 || y > 2100) {
      throw new ApiError(400, "Year must be between 2000 and 2100");
    }

    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 1);

    filter.date = { $gte: start, $lt: end };
  }

  // --------------------
  // Pagination logic
  // --------------------
  let pageNum = Number(page);
  let limitNum = Number(limit);

  if (isNaN(pageNum) || pageNum < 1) pageNum = 1;
  if (isNaN(limitNum) || limitNum < 1) limitNum = 10;
  if (limitNum > 50) limitNum = 50;

  const skip = (pageNum - 1) * limitNum;

  // total count (for pagination metadata)
  const totalItems = await Expense.countDocuments(filter);

  // paginated query
  const expenses = await Expense.find(filter)
    .sort({ date: -1, createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const totalPages = Math.ceil(totalItems / limitNum) || 1;

  return {
    expenses,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalPages,
      totalItems,
    },
  };
};

export const updateExpenseService = async (clerkUserId, expenseId, payload) => {
  if (!mongoose.Types.ObjectId.isValid(expenseId)) {
    throw new ApiError(400, "Invalid expense id");
  }

  const expense = await Expense.findOne({ _id: expenseId, userId: clerkUserId });

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

// ✅ Update only allowed fields (secure allowlist)
const allowedFields = [
  "amount",
  "category",
  "note",
  "paymentMode",
  "essentialType",
  "date",
];

for (const field of allowedFields) {
  if (payload[field] !== undefined) {
    if (field === "date") {
      const parsedDate = new Date(payload.date);
      if (isNaN(parsedDate.getTime())) {
        throw new ApiError(400, "Invalid date format");
      }
      expense.date = parsedDate;
    } else {
      expense[field] = payload[field];
    }
  }
}

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
