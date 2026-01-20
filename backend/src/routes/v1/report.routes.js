import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

import { monthlyReportQuerySchema } from "../../validations/report.validation.js";

import {
  getMonthlyReport,
  getWeeklyReport,
} from "../../controllers/report.controller.js";

const router = Router();

// Monthly report (month/year required)
router.get("/monthly", requireAuth, validate(monthlyReportQuerySchema), getMonthlyReport);

// Weekly report (last 7 days)
router.get("/weekly", requireAuth, getWeeklyReport);

export default router;
