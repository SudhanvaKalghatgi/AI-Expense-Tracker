import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true, unique: true, index: true },

    fullName: { type: String, trim: true },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true, // ✅ 1 email = 1 account
      index: true,
    },

    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true, // ✅ unique username
      sparse: true, // ✅ allows null values without conflict
      index: true,
    },

    userType: {
      type: String,
      enum: ["student", "professional", "business"],
      required: true,
    },

    incomeTrackingMode: {
      type: String,
      enum: ["fixedIncome", "expensesOnly"],
      default: "expensesOnly",
    },

    monthlyIncome: { type: Number, default: null },

    monthlyBudget: { type: Number, default: null },
    savingTarget: { type: Number, default: null },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
