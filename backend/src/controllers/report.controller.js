import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {
  getMonthlyReportService,
  getPreviousMonthComparisonService,
  getWeeklyReportService,
} from "../services/report.service.js";

export const getMonthlyReport = asyncHandler(async (req, res) => {
  const { clerkUserId } = req.user;
  const month = Number(req.query.month);
  const year = Number(req.query.year);

  const report = await getPreviousMonthComparisonService(
    clerkUserId,
    month,
    year
  );

  return res
    .status(200)
    .json(new ApiResponse(200, report, "Monthly report generated ✅"));
});

export const getWeeklyReport = asyncHandler(async (req, res) => {
  const { clerkUserId } = req.user;

  const report = await getWeeklyReportService(clerkUserId);

  return res
    .status(200)
    .json(new ApiResponse(200, report, "Weekly report generated ✅"));
});
