import {Router} from "express";
import {CommunityController} from "../controllers/CommunityController.js";
import {CommunityService} from "../services/CommunityService.js";
import {CommunityRepository} from "../repositories/CommunityRepository.js";

const router = Router();
const communityController = new CommunityController(new CommunityService(new CommunityRepository()));

router.get('/', async (req, res) => await communityController.get(req, res));

router.get('/:id', async (req, res) => await communityController.get(req, res));

router.put('/', async (req, res) => await communityController.put(req, res));

router.delete('/:id', async (req, res) => await communityController.delete(req, res));

export default router;