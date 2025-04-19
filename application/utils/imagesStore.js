import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const saveImage = async (imageBase64, imageDirectory) => {
    const directory = path.join(__dirname, imageDirectory);
    if (!fs.existsSync(directory)) fs.mkdirSync(directory, {recursive: true});

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const fileName = 'communityImage.png';
    const filePath = path.join(directory, fileName);

    fs.writeFileSync(filePath, buffer);

    return filePath;
};

export const getImage = async (imagePath) => {
    const route = path.join(__dirname, imagePath);
    if (!fs.existsSync(route)) return "LogoLinkComNegro.svg";

    const imageBuffer = fs.readFileSync(route);
    return `data:image/png;base64,${imageBuffer.toString('base64')}`;
};

export const fillingCommunityImage = async (response) => {
    if (response.success) for (let i = 0; i < response.data.length; i++){
        response.data[i].imagePath = await getImage(
            `../../images/communities/${response.data[i].id}/communityImage.png`
        );
    }
    return response;
}

export const fillingEventImage = async (response) => {
    if (response.success) for (let i = 0; i < response.data.length; i++){
        response.data[i].imagePath = await getImage(
            `../../images/communities/${response.data[i].communityID}/${response.data[i].id}/eventImage.png`
        );
    }
    return response;
}
