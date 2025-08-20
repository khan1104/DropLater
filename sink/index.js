
import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

const REDIS_HOST = process.env.REDIS_HOST || "redis";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const PORT = process.env.PORT || 4001

const redis = createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

redis.on("error", (err) => console.error("Redis error:", err));
await redis.connect();

app.post("/sink", async (req, res) => {
    try {
        const idempotencyKey = req.header("X-Idempotency-Key");

        if (!idempotencyKey) {
            return res.status(400).json({ error: "Missing X-Idempotency-Key header" });
        }

        const wasSet = await redis.setNX(`idempotency:${idempotencyKey}`, "1");

        if (wasSet === 0) {
            return res.status(200).json({ message: "Duplicate ignored" });
        }

        await redis.expire(`idempotency:${idempotencyKey}`, 86400);

        console.log("Received new delivery:", req.body);

        return res.status(200).json({ message: "Processed successfully" });
    } catch (err) {
        console.error("Error in sink:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log("Sink service running on http://localhost:4001");
});
