import {Router} from "express";
import {EventsController} from "../controllers/EventsController.js";
import {EventsService} from "../services/EventsService.js";
import {SupabaseRepository} from "../repositories/supabaseRepository.js";

const router = Router();
const eventsController = new EventsController(new EventsService(new SupabaseRepository('Events')));

router.put('/:communityID/create', async (req, res) => await eventsController.put(req, res));
router.get('/:id?', async (req, res) => await eventsController.get(req, res));
router.patch('/:id', async (req, res) => await eventsController.patch(req, res));
router.delete('/:id', async (req, res) => await eventsController.delete(req, res));

router.put('/:eventID/join');
router.get('/:eventID/members');
router.delete('/:eventID/:userID/leave');

export default router;