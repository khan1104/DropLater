import { Router } from "express";
import { createNotes,listNotes,replayNote} from "../controllers/notes.js";

const router = Router();


router.post("/notes", createNotes);
router.get("/notes",listNotes);
router.post("/notes/:id/replay", replayNote);

export default router;
