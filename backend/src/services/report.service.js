import { Expense } from "../models/expense.model.js";

/**
 *  Helper: Convert aggregation output to key-value object
 * Example:
 * [{ _id: "Food", total: 500 }, { _id: "Travel", total: 200 }]
 * -> { Food: 500, Travel: 200 }
 */
const arrayToObject = (arr) => {
  const obj = {};
  for (const item of arr) {
    obj[item._id] = item.total;
  }
  return obj;
};

/**
 *  Monthly report using aggregation
 */
export const getMonthlyReportService = async (clerkUserId, month, year) => {
  // month: 1-12
  // JS Date months are 0-based, so month-1 is needed
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  /**
   *  Pipeline explanation:
   *
   * 1) $match -> filter only this user's expenses within the date range
   * 2) $facet -> run multiple breakdown calculations in one query (super efficient)
   *   - totalStats -> total expense + count
   *   - categoryBreakdown -> grouped sum by category
   *   - paymentModeBreakdown -> grouped sum by paymentMode
   *   - needVsWantBreakdown -> grouped sum by essentialType
   */
  const result = await Expense.aggregate([
    {
      $match: {
        userId: clerkUserId,
        date: { $gte: start, $lt: end },
      },
    },
    {
      $facet: {
        totalStats: [
          {
            $group: {
              _id: null,
              totalExpense: { $sum: "$amount" },
              totalTransactions: { $sum: 1 },
            },
          },
        ],

        categoryBreakdown: [
          {
            $group: {
              _id: "$category",
              total: { $sum: "$amount" },
            },
          },
          { $sort: { total: -1 } },
        ],

        paymentModeBreakdown: [
          {
            $group: {
              _id: "$paymentMode",
              total: { $sum: "$amount" },
            },
          },
        ],

        needVsWantBreakdown: [
          {
            $group: {
              _id: "$essentialType",
              total: { $sum: "$amount" },
            },
          },
        ],
      },
    },
  ]);

  const report = result?.[0] || {};

  const totalStats = report.totalStats?.[0] || {
    totalExpense: 0,
    totalTransactions: 0,
  };

  return {
    month,
    year,
    totalExpense: totalStats.totalExpense,
    totalTransactions: totalStats.totalTransactions,

    categoryBreakdown: arrayToObject(report.categoryBreakdown || []),
    paymentModeBreakdown: arrayToObject(report.paymentModeBreakdown || []),
    needVsWantBreakdown: arrayToObject(report.needVsWantBreakdown || []),
  };
};

/**
 *  Previous month comparison
 */
export const getPreviousMonthComparisonService = async (
  clerkUserId,
  month,
  year
) => {
  // Calculate previous month/year
  let prevMonth = month - 1;
  let prevYear = year;

  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear = year - 1;
  }

  const current = await getMonthlyReportService(clerkUserId, month, year);
  const previous = await getMonthlyReportService(clerkUserId, prevMonth, prevYear);

  const diff = current.totalExpense - previous.totalExpense;

  let changeType = "no_change";
  if (diff > 0) changeType = "increased";
  if (diff < 0) changeType = "decreased";

  return {
    current,
    previous,
    comparison: {
      previousMonth: prevMonth,
      previousYear: prevYear,
      difference: diff,
      changeType,
    },
  };
};

/**
 *  Weekly report (last 7 days)
 */
export const getWeeklyReportService = async (clerkUserId) => {
  const end = new Date(); // now
  const start = new Date();
  start.setDate(end.getDate() - 7);

  const result = await Expense.aggregate([
    {
      $match: {
        userId: clerkUserId,
        date: { $gte: start, $lte: end },
      },
    },
    {
      $facet: {
        totalStats: [
          {
            $group: {
              _id: null,
              totalExpense: { $sum: "$amount" },
              totalTransactions: { $sum: 1 },
            },
          },
        ],
        categoryBreakdown: [
          {
            $group: {
              _id: "$category",
              total: { $sum: "$amount" },
            },
          },
          { $sort: { total: -1 } },
        ],
        paymentModeBreakdown: [
          {
            $group: {
              _id: "$paymentMode",
              total: { $sum: "$amount" },
            },
          },
        ],
        needVsWantBreakdown: [
          {
            $group: {
              _id: "$essentialType",
              total: { $sum: "$amount" },
            },
          },
        ],
      },
    },
  ]);

  const report = result?.[0] || {};

  const totalStats = report.totalStats?.[0] || {
    totalExpense: 0,
    totalTransactions: 0,
  };

  return {
    range: {
      start,
      end,
    },
    totalExpense: totalStats.totalExpense,
    totalTransactions: totalStats.totalTransactions,
    categoryBreakdown: arrayToObject(report.categoryBreakdown || []),
    paymentModeBreakdown: arrayToObject(report.paymentModeBreakdown || []),
    needVsWantBreakdown: arrayToObject(report.needVsWantBreakdown || []),
  };
};
