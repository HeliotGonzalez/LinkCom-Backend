import {Router} from "express";
import {CommunityService} from "../../architecture/io/services/CommunityService.js";
import factory from "../utils/RepositoryFactory.js";
import {HTTPMethodsMap} from "../utils/HTTPUtils.js";
import {buildCriteriaFrom, builderFactory, handleError} from "../utils/CiteriaUtils.js";
import {UserService} from "../../architecture/io/services/UserService.js";

const router = Router();
const communityService = new CommunityService(factory);
const userService = new UserService(factory);

router.put('/', async (req, res) => handleError(HTTPMethodsMap.PUT, res, await communityService.create(req.body)));
router.get('/:id?', async (req, res) => handleError(HTTPMethodsMap.GET, res, await communityService.get(
    buildCriteriaFrom({...req.params, ...req.query})
)));
router.get('/excluding/:userID', async (req, res) => {
    const userCommunities = (await userService.communities([builderFactory.get('eq')('userID', req.params.userID).build()])).data.map(c => c.communityID);
    return handleError(HTTPMethodsMap.GET, res, await communityService.excludingUser(
        [builderFactory.get('nin')('id', userCommunities).build()]
    ))
})
router.patch('/:id', async (req, res) => handleError(HTTPMethodsMap.PATCH, res, await communityService.update(
    buildCriteriaFrom({...req.params, ...req.query}), req.body
)));
router.delete('/:id', async (req, res) => handleError(HTTPMethodsMap.DELETE, res, await communityService.remove(
    buildCriteriaFrom({...req.params, ...req.query})
)));
router.put('/:communityID/join', async (req, res) => handleError(HTTPMethodsMap.PUT, res, await communityService.join(req.params.communityID, req.body.userID)));
router.get('/:communityID/members', async (req, res) => handleError(HTTPMethodsMap.GET, res, await communityService.members(
    buildCriteriaFrom({...req.params, ...req.query})
)));
router.patch('/:communityID/:userID/changeRole', async (req, res) => handleError(HTTPMethodsMap.PATCH, res, await communityService.changeRole(req.body.communityRole,
    buildCriteriaFrom({...req.params, ...req.query})
)));
router.delete('/:communityID/:userID/leave', async (req, res) => handleError(HTTPMethodsMap.DELETE, res, await communityService.leave(req.params.communityID, req.params.userID)));
router.delete('/:communityID/:userID/leave', async (req, res) => handleError(HTTPMethodsMap.DELETE, res, await communityService.leave(req.params.communityID, req.params.userID)));

export default router;