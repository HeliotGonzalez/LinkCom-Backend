import {Router} from "express";
import {buildCriteriaFrom, handleError} from "../utils/CiteriaUtils.js";
import {HTTPMethodsMap} from "../utils/HTTPUtils.js";
import {serviceFactory} from "../utils/ServicesUtils.js";

const router = Router();

router.get('/:id?', async (req, res) => {
    return handleError(HTTPMethodsMap.GET, res, await serviceFactory.get('users').get(
        buildCriteriaFrom({...req.params, ...req.query})
    ))
})

export default router;