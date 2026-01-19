import { ApiError } from "../utils/ApiError.js";

export const requireAuth = (req, res, next) => {
  const clerkUserId = req.header("x-user-id");

  if (!clerkUserId) {
    throw new ApiError(401, "Unauthorized: x-user-id header missing");
  }

  req.user = { clerkUserId };
  next();
};
