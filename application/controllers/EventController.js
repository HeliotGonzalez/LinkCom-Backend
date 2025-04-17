import {Router} from "express";
import {buildCriteriaFrom, builderFactory, handleError} from "../utils/CiteriaUtils.js";
import {HTTPMethodsMap} from "../utils/HTTPUtils.js";
import {serviceFactory} from "../utils/ServicesUtils.js";
import {fillingEventImage, saveImage} from "../utils/imagesStore.js";

const router = Router();

router.get('/', async (req, res) => handleError(HTTPMethodsMap.GET, res, await  fillingEventImage(await serviceFactory.get('events').get())));
router.get('/:id?', async (req, res) => handleError(HTTPMethodsMap.GET, res, await fillingEventImage(await serviceFactory.get('events').get(buildCriteriaFrom({...req.params, ...req.query})))));
router.get('/excluding/:userID', async (req, res) => {
    const userEvents = (await serviceFactory.get('events').userEvents(buildCriteriaFrom({userID: req.params.userID}))).map(e => e.eventID);
    return handleError(HTTPMethodsMap.GET, res, await fillingEventImage(await serviceFactory.get('events').get(
        [builderFactory.get('nin')('eventID', userEvents).build()]
    )));
});
router.get('/:eventID/members', async (req, res) => handleError(HTTPMethodsMap.GET, res, await serviceFactory.get('events').members(builderFactory({...req.params, ...req.query}))));
router.put('/', async (req, res) => {
    const creationResponse = await serviceFactory.get('events').create(req.body);
    if (creationResponse.success && req.body.imagePath) {
        creationResponse.data.imagePath = await saveImage(req.body.image, `images/communities/${req.body.communityID}/${creationResponse.data.id}`);
        await serviceFactory.get('events').update(
            [builderFactory.get('eq')('id', creationResponse.data.id).build()],
            {imagePath: creationResponse.data.imagePath}
        );
    }
    return handleError(HTTPMethodsMap.PUT, res, creationResponse);
});
router.delete('/:id', async (req, res) => handleError(HTTPMethodsMap.DELETE, res, serviceFactory.get('events').remove(buildCriteriaFrom({...req.params, ...req.query}))));
router.put('/:eventID/join', async (req, res) => {
    const communityID = (await serviceFactory.get('events').get(buildCriteriaFrom({id: req.params.eventID}))).data[0].communityID;
    handleError(HTTPMethodsMap, res, await serviceFactory.get('events').join(communityID, req.params.eventID, req.body.userID));
});
router.delete('/:eventID/:userID/leave', async (req, res) => handleError(HTTPMethodsMap.DELETE, res, await serviceFactory.get('events').leave(buildCriteriaFrom({...req.params, ...req.query}))));

export default router;