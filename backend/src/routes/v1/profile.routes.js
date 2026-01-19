import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

import {
  onboardProfileSchema,
} from "../../validations/profile.validation.js";

import {
  onboardProfile,
  getMyProfile,
} from "../../controllers/profile.controller.js";

const router = Router();

// onboarding / update profile
router.post("/onboard", requireAuth, validate(onboardProfileSchema), onboardProfile);

// get logged in user's profile
router.get("/me", requireAuth, getMyProfile);

export default router;
