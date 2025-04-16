// src/routes/CommunityRoutes.js
import { Router } from "express";
import { CommunityController } from "../controllers/CommunityController.js";
import { CommunityService } from "../services/CommunityService.js";
import { SupabaseRepository } from "../repositories/SupabaseRepository.js";
import { CommunityUserController } from "../controllers/communityUserController.js";
import { CommunityUserService } from "../services/communityUserService.js";
import { upload } from "../../upload.js";

const router = Router();

// Instanciar repositorios (se usa el genérico para cada tabla)
const communityRepository = new SupabaseRepository('Communities');
// Los repositorios para Users y CommunityUser se inyectan en el servicio
const communityService = new CommunityService(communityRepository);
const communityController = new CommunityController(communityService);

const communityUserRepository = new SupabaseRepository('CommunityUser');
const communityUserService = new CommunityUserService(communityUserRepository);
const communityUserController = new CommunityUserController(communityUserService);

// Rutas específicas primero
router.get('/nonBelongingCommunities', async (req, res) =>
  await communityController.getNonBelongingCommunities(req, res)
);

// Rutas genéricas
router.put('/', async (req, res) => await communityController.put(req, res));
router.get('/:id?', async (req, res) => await communityController.get(req, res));
router.patch("/:id", upload.single("image"), async (req, res) => {
  return await communityController.patch(req, res);
});

router.delete('/:id', async (req, res) => await communityController.delete(req, res));

router.put('/:communityID/join', async (req, res) => await communityUserController.put(req, res));
router.get('/:communityID/members', async (req, res) => await communityUserController.get(req, res));
router.patch('/:communityID/:userID/changeRole', async (req, res) => await communityUserController.patch(req, res));
router.delete('/:communityID/:userID/leave', async (req, res) => await communityUserController.delete(req, res));

export default router;
