import { Router } from "express";
import {
    createAnimal,
    getAnimais,
    getAnimalById,
    updateAnimal,
    deleteAnimal
} from "../controllers/animalController";

const router = Router();

router.post("/", createAnimal);
router.get("/", getAnimais);
router.get("/:id", getAnimalById);
router.patch("/:id", updateAnimal);
router.delete("/:id", deleteAnimal);

export default router;