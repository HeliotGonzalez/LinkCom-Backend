import { Router } from "express";
import { AnnouncementController } from "../controllers/AnnouncementController.js";
import { AnnouncementService } from "../services/AnnouncementService.js";
import { SupabaseRepository } from "../repositories/SupabaseRepository.js";

// 1. Instancia el repositorio apuntando a la tabla "Announcements"
const announcementRepository = new SupabaseRepository("Announcements");

// 2. Crea la instancia del servicio inyectando el repositorio
const announcementService = new AnnouncementService(announcementRepository);

// 3. Crea el controlador, inyectándole el servicio
const announcementController = new AnnouncementController(announcementService);

// 4. Define el router para Announcement
const router = Router();

// CREATE: se usa PUT o POST (tú decides). Aquí usamos PUT, igual que en Community
router.put("/", async (req, res) => {
  return announcementController.put(req, res);
});

// READ: obtener uno o varios (si pasas id o no)
router.get("/:id?", async (req, res) => {
  return announcementController.get(req, res);
});

// UPDATE
router.patch("/:id", async (req, res) => {
  return announcementController.patch(req, res);
});

// DELETE
router.delete("/:id", async (req, res) => {
  return announcementController.delete(req, res);
});

export default router;
