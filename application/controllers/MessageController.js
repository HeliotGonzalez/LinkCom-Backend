import {Router} from "express";
import {builderFactory, handleError} from "../utils/CiteriaUtils.js";
import {HTTPMethodsMap} from "../utils/HTTPUtils.js";
import {serviceFactory} from "../utils/ServicesUtils.js";

const router = Router();

const buildCriteriaFromFrontend = (raw) => {
    const criteria = JSON.parse(raw);
    const filters = [];
    criteria.filters.forEach(f => {
        console.log(f);
        filters.push(builderFactory.get(f.operator)(f.field, f.value).build())
    });
    if (criteria.order) filters.push(builderFactory.get('order')(criteria.order.field, criteria.order.direction).build());
    return filters;
}

router.get('/:criteria', async (req, res) => handleError(HTTPMethodsMap.GET, res, await serviceFactory.get('messages').get(buildCriteriaFromFrontend(atob(req.params['criteria'])))));
router.put('/', async (req, res) => {
    console.log(req.body)
    handleError(HTTPMethodsMap.PUT, res, await serviceFactory.get('messages').send(req.body))
});
router.patch('/:criteria', async (req, res) => handleError(HTTPMethodsMap.PATCH, res, await serviceFactory.get('messages').update(buildCriteriaFromFrontend(atob(req.params['criteria']), req.body))));
router.delete('/:criteria', async (req, res) => handleError(HTTPMethodsMap.DELETE, res, await serviceFactory.get('messages').delete(buildCriteriaFromFrontend(atob(req.params['criteria'])))));

export default router;