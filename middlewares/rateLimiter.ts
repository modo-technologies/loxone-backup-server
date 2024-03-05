import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  headers: true,
  handler: (_req, res) => {
    res.status(429).json({ message: "Exceeded request limit." });
  },
});

export const backupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  max: 5,
  handler: (_req, res) => {
    res
      .status(429)
      .json({ message: "Exceeded request limit. Allowance: 5 requests/hour." });
  },
  headers: true,
});

export default limiter;
