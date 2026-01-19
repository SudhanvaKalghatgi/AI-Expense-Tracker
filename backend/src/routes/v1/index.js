import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API v1 health is OK ✅",
  });
});

export default router;
