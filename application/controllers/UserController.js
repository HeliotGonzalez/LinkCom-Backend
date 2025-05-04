import {Router} from "express";
import {buildCriteriaFrom, handleError} from "../utils/CiteriaUtils.js";
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
    const response = await serviceFactory.get('users').events(
            buildCriteriaFrom({...req.params, ...req.query})
    );
    if (response.success) response.data = response.data.map(e => e.Events)
    return handleError(HTTPMethodsMap.GET, res, await fillingCommunityImage(
            response
    ));
});
export default router;