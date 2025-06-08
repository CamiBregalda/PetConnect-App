import { Router } from "express";
import * as animalController from '../controllers/animalController';
import * as abrigoController from '../controllers/abrigoController';
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
router.get('/adotados/:userId', animalController.getAnimaisAdotadosPorUsuario);
router.get('/voluntarios/:userId', abrigoController.getAbrigosPorVoluntario
);

router.post('/:id/imagem', uploadImage);
router.get('/:id/imagem', getImage);
router.delete('/:id/imagem', deleteImage);

export default router;