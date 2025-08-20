
import { Worker, Queue } from "bullmq";
import mongoose from "mongoose";
import axios from "axios";
import crypto from "crypto";

import { Note } from "./schema.js"

const MONGO_URI = process.env.MONGO_URI || "mongodb://host.docker.internal:27017/DropLater";

await mongoose.connect(MONGO_URI);

function getIdempotencyKey(note) {
    return crypto.createHash("sha256").update(note._id.toString() + note.releaseAt).digest("hex");
}


const retryDelays = [1000, 5000, 25000];

const REDIS_HOST = process.env.REDIS_HOST || "redis";
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const notesWorker = new Worker(
    "NotesQueue",
    async (job) => {
        const noteData = job.data;
        try {
            const idempotencyKey = getIdempotencyKey(noteData);

            const response = await axios.post(noteData.webhookUrl, noteData, {
                headers: {
                    "X-Note-Id": noteData._id,
                    "X-Idempotency-Key": idempotencyKey,
                },
            });
            await Note.findByIdAndUpdate(noteData._id, {
                status: "delivered",
                deliveredAt: new Date(),
                $push: { attempts: { at: new Date(), statusCode: response.status, ok: true } },
            });

            console.log(`Delivered note ${noteData._id}`);
        } catch (err) {
            noteData.attempts.push({
                at: new Date(),
                statusCode: err.response?.status,
                ok: false,
                error: err.message,
            });


            await Note.findByIdAndUpdate(noteData._id, { attempts: noteData.attempts });

            const attemptNumber = noteData.attempts.length;

            if (attemptNumber <= retryDelays.length) {
                const delay = retryDelays[attemptNumber - 1];
                console.log(`Retry ${attemptNumber} for note ${noteData._id} in ${delay / 1000}s`);

                const queue = new Queue("NotesQueue", { connection: { host: REDIS_HOST, port: REDIS_PORT } });
                await queue.add("note", noteData, { delay });

            } else {
                await Note.findByIdAndUpdate(noteData._id, { status: "dead" });
                console.error(`Note ${noteData._id} marked dead after ${attemptNumber - 1} retries`);
            }

            throw err;
        }
    },
    {
        connection: { host: REDIS_HOST, port: REDIS_PORT },
    }
);


notesWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

notesWorker.on("failed", (job, err) => {
    console.error(`Job ${job.id} failed: ${err.message}`);
});

console.log("Notes worker running...");
