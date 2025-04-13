import {Router} from "express";
import {CommunityController} from "../controllers/CommunityController.js";
import {CommunityService} from "../services/CommunityService.js";
import {SupabaseRepository} from "../repositories/SupabaseRepository.js";
import {CommunityUserController} from "../controllers/communityUserController.js";
import {CommunityUserService} from "../services/communityUserService.js";

const router = Router();
const communityController = new CommunityController(new CommunityService(new SupabaseRepository('Communities')));
const communityUserController = new CommunityUserController(new CommunityUserService(new SupabaseRepository('CommunityUser')));

router.put('/', async (req, res) => await communityController.put(req, res));
router.get('/:id?', async (req, res) => await communityController.get(req, res));
router.patch('/:id', async (req, res) => await communityController.patch(req, res));
router.delete('/:id', async (req, res) => await communityController.delete(req, res));

router.put('/:communityID/join', async (req, res) => await communityUserController.put(req, res));
router.get('/:communityID/members', async (req, res) => await communityUserController.get(req, res));
router.patch('/:communityID/:userID/changeRole', async (req, res) => await communityUserController.patch(req, res));
router.delete('/:communityID/:userID/leave', async (req, res) => await communityUserController.delete(req, res));

export default router;