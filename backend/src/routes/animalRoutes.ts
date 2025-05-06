import { Router } from "express";
import {
    createAnimal,
    getAnimais,
    getAnimalById,
    updateAnimal,
    deleteAnimal,
    uploadImage, 
    getImage, 
    deleteImage
} from "../controllers/animalController";

const router = Router();

router.post("/", createAnimal);
router.get("/", getAnimais);
router.get("/:id", getAnimalById);
router.put("/:id", updateAnimal);
router.delete("/:id", deleteAnimal);

router.post('/:id/image', uploadImage);
router.get('/:id/image', getImage);
router.delete('/:id/image', deleteImage);

export default router;