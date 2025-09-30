import { Router } from "express";
import { getEventImages, getEventImageById, createEventImage, updateEventImage, deleteEventImage } from "../controllers/eventImageController.js";

const router = Router();

router.get("/", getEventImages);
router.get("/:id", getEventImageById);
router.post("/", createEventImage);
router.put("/:id", updateEventImage);
router.delete("/:id", deleteEventImage);

export default router;
