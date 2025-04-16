import {Router} from "express";
import {UserService} from "../../architecture/io/services/UserService.js";
import factory from "../utils/RepositoryFactory.js";
import {buildCriteriaFrom, handleError} from "../utils/CiteriaUtils.js";
import {HTTPMethodsMap} from "../utils/HTTPUtils.js";

const router = Router();
const userService = new UserService(factory);

router.get('/:id?', async (req, res) => {
    return handleError(HTTPMethodsMap.GET, res, await userService.get(
        buildCriteriaFrom({...req.params, ...req.query})
    ))
})

export default router;