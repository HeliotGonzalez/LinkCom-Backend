import {Router} from "express";
import {CommunityUserController} from "../controllers/CommunityUserController.js";
import {CommunityUserService} from "../services/CommunityUserService.js";
import {CommunityUserRepository} from "../repositories/CommunityUserRepository.js";

const router = Router();
const communityUserController = new CommunityUserController(new CommunityUserService(new CommunityUserRepository()));

router.get('/:id', async (req, res) => await communityUserController.get(req, res));

router.put('/:id/join', async (req, res) => await communityUserController.put(req, res));

router.delete('/:id/leave', async (req, res) => await communityUserController.delete(req, res));

router.patch('/:id/role', async (req, res) => await communityUserController.patch(req, res));

export default router;