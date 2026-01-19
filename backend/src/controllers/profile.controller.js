import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {
  createOrUpdateProfileService,
  getMyProfileService,
} from "../services/profile.service.js";

export const onboardProfile = asyncHandler(async (req, res) => {
  const { clerkUserId } = req.user;

  const profile = await createOrUpdateProfileService(clerkUserId, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, profile, "Profile onboarded successfully ✅"));
});

export const getMyProfile = asyncHandler(async (req, res) => {
  const { clerkUserId } = req.user;

  const profile = await getMyProfileService(clerkUserId);

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Profile fetched successfully ✅"));
});
