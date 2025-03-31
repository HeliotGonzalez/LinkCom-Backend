import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const saveImage = async (imageBase64, imageDirectory) => {
    const directory = path.join(__dirname, imageDirectory);
    if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const fileName = 'communityImage.png';
    const filePath = path.join(directory, fileName);

    fs.writeFileSync(filePath, buffer);
};
