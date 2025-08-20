import { Queue } from 'bullmq';
import { Note } from "../models/notes.js";
import { noteSchema } from "../schemas/notes.js";

const notesQueue = new Queue("NotesQueue", {
    connection: {
        host: process.env.REDIS_HOST || "redis", // Docker service name
        port: parseInt(process.env.REDIS_PORT) || 6379,
    }
});

notesQueue.client.then(() => {
    console.log("Redis connected for NotesQueue");
}).catch((err) => {
    console.error("Redis connection failed:", err.message);
});


export const createNotes = async (req, res) => {
    const result = noteSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Validation error",
            errors: result.error.format(),
        });
    }

    try {
        const newNote = await Note.create(result.data);

        const now = new Date();
        const releaseAt = new Date(newNote.releaseAt);
        const delay = releaseAt.getTime() - now.getTime();

        await notesQueue.add("note", newNote, {
            delay: delay > 0 ? delay : 0,
            removeOnComplete: true,
            removeOnFail: false,
        });
        res.status(200).json({ id: newNote._id });
    } catch (err) {
        res.status(500).json({ message: "Database error", error: err.message });
    }
};

export const listNotes = async (req, res) => {
    try {
        let { status, page } = req.query;

        page = parseInt(page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        let filter = {};
        if (status) filter.status = status;

        const notes = await Note.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({ notes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const replayNote = async (req, res) => {
    try {
        const { id } = req.params;

        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({ message: "Note not found in the database" });
        }

        if (note.status !== "failed" && note.status !== "dead") {
            return res.status(400).json({ message: "Only failed or dead notes can be replayed" });
        }

        note.status = "pending";
        await note.save();

        await notesQueue.add("note", note.toObject(), {
            delay: new Date(note.releaseAt).getTime() - Date.now(),
            removeOnComplete: true,
            removeOnFail: false,
        });

        res.json({ message: "Note requeued successfully", note });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
