import rateLimit from "express-rate-limit";

// Allow max 100 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
    windowMs:1 *60 * 1000, // 15 minutes
    max:60, // limit each IP to 100 requests per window
    message: {
        status: 429,
        error: "Too many requests, please try again later.",
    }, // Disable the `X-RateLimit-*` headers
});
