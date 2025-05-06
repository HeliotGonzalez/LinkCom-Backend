import {Router} from "express";
import {buildCriteriaFrom, builderFactory, handleError} from "../utils/CiteriaUtils.js";
import {HTTPMethodsMap} from "../utils/HTTPUtils.js";
import {serviceFactory} from "../utils/ServicesUtils.js";
import {fillingCommunityImage} from "../utils/imagesStore.js";

const router = Router();

router.get('/profile/:id?', async (req, res) => {
    const criteria = buildCriteriaFrom({ ...req.params, ...req.query });
    const result   = await serviceFactory.get('users').profile(criteria);
    return handleError(HTTPMethodsMap.GET, res, result);
});

router.patch('/:id', async (req, res) =>
      handleError(HTTPMethodsMap.PATCH, res, await serviceFactory.get('users').update(buildCriteriaFrom({ ...req.params, ...req.query }),
            req.body)));

router.get('/:id?', async (req, res) => {
    return handleError(HTTPMethodsMap.GET, res, await serviceFactory.get('users').get(buildCriteriaFrom({...req.params, ...req.query})))
});

router.get('/:userID/communities', async (req, res) => {
    const response = await serviceFactory.get('users').communities(
        buildCriteriaFrom({...req.params, ...req.query})
    );
    if (response.success) response.data = response.data.map(e => e.Communities)
    return handleError(HTTPMethodsMap.GET, res, await fillingCommunityImage(
        response
    ));
});

router.get('/:userID/events', async (req, res) => {
    const response = await serviceFactory.get('users').events(buildCriteriaFrom({...req.params, ...req.query}));
    
    if (response.success) response.data = response.data.map(e => e.Events)

    return handleError(HTTPMethodsMap.GET, res, await fillingCommunityImage(response));
});

router.post('/:from/makeFriendRequest', async (req, res) => handleError(HTTPMethodsMap.PUT, res, await serviceFactory.get('users').makeFriendRequest({...req.params, ...req.body})));
router.get('/:to/friendRequests', async (req, res) => handleError(HTTPMethodsMap.GET, res, await serviceFactory.get('users').friendRequests(buildCriteriaFrom({...req.query}))));
router.patch('/:from/updateFriendRequest', async (req, res) => {
    const response = await serviceFactory.get('users').updateFriendRequest(buildCriteriaFrom({...req.params, ...req.query}), req.body);
    if (response.data[0]['status'] === 'accepted') await serviceFactory.get('users').addFriend(response.data[0]['from'], response.data[0]['to']);
    handleError(HTTPMethodsMap.PATCH, res, response);
});
router.delete('/:from/cancelFriendRequest', async (req, res) => handleError(HTTPMethodsMap.DELETE, res, await serviceFactory.get('users').cancelFriendRequest(buildCriteriaFrom({...req.params, ...req.query}))));

router.get('/:userID/getFriends', async (req, res) => {
    const userID = req.params.userID;

    const result = await serviceFactory.get('users').getFriends(userID);

    return handleError(HTTPMethodsMap.GET, res, result);
});

export default router;