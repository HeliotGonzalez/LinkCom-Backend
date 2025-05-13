import {Router} from "express";
import {buildCriteriaFrom, builderFactory, handleError} from "../utils/CiteriaUtils.js";
import {HTTPMethodsMap} from "../utils/HTTPUtils.js";
import {serviceFactory} from "../utils/ServicesUtils.js";
import {fillingEventImage, saveImage} from "../utils/imagesStore.js";

const router = Router();

router.get('/:id?', async (req, res) => {
    handleError(HTTPMethodsMap.GET, res, await fillingEventImage(await serviceFactory.get('events').get(buildCriteriaFrom({...req.params, ...req.query}))))
});
router.get('/:userID', async (req, res) => {
    const userEventsIDs = serviceFactory.get('Events')
})
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
        await serviceFactory.get('events').update(
            [builderFactory.get('eq')('id', creationResponse.data[0].id).build()],
            {imagePath: await saveImage(req.body.imagePath, `../../images/communities/${req.body.communityID}/${creationResponse.data[0].id}`)}
        );
    }
    handleError(HTTPMethodsMap.PUT, res, creationResponse);
});
router.delete('/:id', async (req, res) => handleError(HTTPMethodsMap.DELETE, res, await serviceFactory.get('events').remove(buildCriteriaFrom({...req.params, ...req.query}))));
router.put('/:eventID/join', async (req, res) => handleError(HTTPMethodsMap.PUT, res, await serviceFactory.get('events').join({...req.params, ...req.body})));
router.delete('/:eventID/:userID/leave', async (req, res) => handleError(HTTPMethodsMap.DELETE, res, await serviceFactory.get('events').leave(buildCriteriaFrom({...req.params, ...req.query}))));
router.get('/:eventID/:userID/joined', async (req, res) => handleError(HTTPMethodsMap.GET, res, await serviceFactory.get('events').isJoined(buildCriteriaFrom({...req.params, ...req.query}))));
router.get('/joined/:userID', async (req, res) => {
    const response = await serviceFactory.get('events').userEvents(buildCriteriaFrom({...req.params, ...req.query}));
    if (response.success) response.data = response.data.map(e => e['Events']);
    handleError(HTTPMethodsMap.GET, res, response)
});
router.post('/:eventID/createComment', async (req, res) => handleError(HTTPMethodsMap.PUT, res, await serviceFactory.get('events').createComment({...req.params, ...req.body})));
router.get('/:eventID/getComments', async (req, res) => handleError(HTTPMethodsMap.GET, res, await serviceFactory.get('events').getComments(buildCriteriaFrom({...req.params, ...req.query}))));
router.patch('/:id/update', async (req, res) => handleError(HTTPMethodsMap.PATCH, res, await serviceFactory.get('events').update(buildCriteriaFrom({...req.params, ...req.query}), req.body)));

export default router;