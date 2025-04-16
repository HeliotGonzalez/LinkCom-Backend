import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const communityID = req.params.id; // Asegúrate de que la ruta tenga :id
      const uploadPath = path.join(".", "images", "communities", communityID);
      // Crea la carpeta si no existe
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // Obtener la extensión original
      const ext = path.extname(file.originalname);
      const newFilename = "CommunityImage" + ext;
      const communityID = req.params.id;
      const uploadPath = path.join(".", "images", "communities", communityID);
      const filePath = path.join(uploadPath, newFilename);
  
      // Si ya existe un archivo con ese nombre, lo eliminamos
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      cb(null, newFilename);
    },
  });

export const upload = multer({ storage });
