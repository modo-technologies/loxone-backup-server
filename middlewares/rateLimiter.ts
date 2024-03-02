import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  headers: true,
  handler: (_req, res) => {
    res
      .status(429)
      .json({ message: "Too many requests, please try again later. " });
  },
});

export default limiter;
