import {Router} from "express";
import {HTTPMethodsMap} from "../utils/HTTPUtils.js";
import {buildCriteriaFrom, builderFactory, handleError} from "../utils/CiteriaUtils.js";
import {serviceFactory} from "../utils/ServicesUtils.js";
import {fillingCommunityImage, fillingEventImage, saveImage} from "../utils/imagesStore.js";

const router = Router();

router.put('/', async (req, res) => {
    const creationResponse = await serviceFactory.get('communities').create(req.body.parameters, req.body.interests);
    if (creationResponse.success && req.body.parameters.imagePath) {
        creationResponse.data[0].imagePath = await saveImage(req.body.parameters.imagePath, `../../images/communities/${creationResponse.data[0].id}`);
        await serviceFactory.get('communities').update(
            [builderFactory.get('eq')('id', creationResponse.data[0].id).build()],
            {imagePath: creationResponse.data[0].imagePath}
        );
    }
    return handleError(HTTPMethodsMap.PUT, res, creationResponse);
});
router.get('/:id?', async (req, res) => {
    return handleError(HTTPMethodsMap.GET, res, await fillingCommunityImage(await serviceFactory.get('communities').get(
        buildCriteriaFrom({...req.params, ...req.query})
    )));
});
router.get('/excluding/:userID', async (req, res) => {
    const userCommunities = (await serviceFactory.get('users').communities(buildCriteriaFrom({userID: req.params.userID}))).data.map(c => c.communityID);
    return handleError(HTTPMethodsMap.GET, res, await fillingCommunityImage(await serviceFactory.get('communities').get(
        [...buildCriteriaFrom(req.query), builderFactory.get('nin')('id', userCommunities).build()]
    )));
});
router.patch('/:id', async (req, res) => handleError(HTTPMethodsMap.PATCH, res, await serviceFactory.get('communities').update(
    buildCriteriaFrom({...req.params, ...req.query}), req.body
)));
router.delete('/:id', async (req, res) => handleError(HTTPMethodsMap.DELETE, res, await serviceFactory.get('communities').remove(
    buildCriteriaFrom({...req.params, ...req.query})
)));
router.put('/:communityID/join', async (req, res) => handleError(HTTPMethodsMap.PUT, res, await serviceFactory.get('communities').join(req.params.communityID, req.body.userID, 'member')));
router.get('/:communityID/members', async (req, res) => {
    const communityMembers = (await serviceFactory.get('communities').members(
        buildCriteriaFrom({...req.params, ...req.query, communityRole: 'member'})
    )).data.map(u => u['userID']);
    return handleError(HTTPMethodsMap.GET, res, await serviceFactory.get('users').get(buildCriteriaFrom({id: `in;${communityMembers.join(',')}`})));
});
router.get('/:communityID/moderators', async (req, res) => {
    const communityMembers = (await serviceFactory.get('communities').members(
        buildCriteriaFrom({...req.params, ...req.query, communityRole: 'moderator'})
    )).data.map(u => u['userID']);
    return handleError(HTTPMethodsMap.GET, res, await serviceFactory.get('users').get(buildCriteriaFrom({id: `in;${communityMembers.join(',')}`})));
});
router.patch('/:communityID/:userID/changeRole', async (req, res) => handleError(HTTPMethodsMap.PATCH, res, await serviceFactory.get('communities').changeRole(
    buildCriteriaFrom({...req.params, ...req.query}),
    req.body
)));
router.delete('/:communityID/:userID/leave', async (req, res) => handleError(HTTPMethodsMap.DELETE, res, await serviceFactory.get('communities').leave(buildCriteriaFrom({...req.params, ...req.query}))));
router.get('/:communityID/announcements', async (req, res) => handleError(HTTPMethodsMap.GET, res, await serviceFactory.get('communities').announcements(buildCriteriaFrom({...req.params, ...req.query}))));
router.get('/:communityID/events', async (req, res) => handleError(HTTPMethodsMap.GET, res, await fillingEventImage(await serviceFactory.get('communities').events(buildCriteriaFrom({...req.params, ...req.query})))));

export default router;