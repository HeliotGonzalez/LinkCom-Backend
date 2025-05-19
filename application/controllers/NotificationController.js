import {Router} from "express";
import {buildCriteriaFromEncoded, handleError} from "../utils/CiteriaUtils.js";
import {HTTPMethodsMap} from "../utils/HTTPUtils.js";
import {serviceFactory} from "../utils/ServicesUtils.js";

const router = Router();

router.put('/', async (req, res) => handleError(HTTPMethodsMap.PUT, res, await serviceFactory.get('notifications').create(req.body)));
router.get('/:criteria', async (req, res) => handleError(HTTPMethodsMap.GET, res, await serviceFactory.get('notifications').get(buildCriteriaFromEncoded(req.params['criteria']))));
router.patch('/:criteria', async (req, res) => handleError(HTTPMethodsMap.PATCH, res, await serviceFactory.get('notifications').update(buildCriteriaFromEncoded(req.params['criteria']), req.body)));
router.delete('/:criteria', async (req, res) => handleError(HTTPMethodsMap.DELETE, res, await serviceFactory.get('notifications').delete(buildCriteriaFromEncoded(req.params['criteria']))));

export default router;