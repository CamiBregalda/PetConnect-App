import { Router } from "express";
import {
    createAnimal,
    getAnimais,
    getAnimalById,
    getAnimaisAdotadosPorUsuario,
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
router.get('/usuario/:userId', getAnimaisAdotadosPorUsuario);
router.put("/:id", updateAnimal);
router.delete("/:id", deleteAnimal);

router.post('/:id/imagem', uploadImage);
router.get('/:id/imagem', getImage);
router.delete('/:id/imagem', deleteImage);

export default router;