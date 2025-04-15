import {Router} from "express";
import {CommunityUserController} from "../controllers/communityUserController.js";
import {CommunityUserService} from "../services/communityUserService.js";
import { SupabaseRepository } from "../repositories/SupabaseRepository.js";

const router = Router();
const communityUserController = new CommunityUserController(new CommunityUserService(new SupabaseRepository('CommunityUser')));

router.post('/joinCommunity', async (req, res) => await communityUserController.joinCommunity(req, res));

router.put('/:id/join', async (req, res) => await communityUserController.put(req, res));

router.get('/:id', async (req, res) => await communityUserController.get(req, res));

router.patch('/:id/role', async (req, res) => await communityUserController.patch(req, res));

router.delete('/:id/leave', async (req, res) => await communityUserController.delete(req, res));

export default router;