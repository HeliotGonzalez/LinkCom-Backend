import {Router} from "express";
import {handleError} from "../utils/CiteriaUtils.js";
import {HTTPMethodsMap} from "../utils/HTTPUtils.js";
import {serviceFactory} from "../utils/ServicesUtils.js";
import {buildCriteriaFromEncoded} from "../utils/CiteriaUtils.js";

const router = Router();

router.get('/:criteria', async (req, res) => handleError(HTTPMethodsMap.GET, res, await serviceFactory.get('messages').get(buildCriteriaFromEncoded(req.params['criteria']))));
router.put('/', async (req, res) => handleError(HTTPMethodsMap.PUT, res, await serviceFactory.get('messages').send(req.body)));
router.patch('/:criteria', async (req, res) => handleError(HTTPMethodsMap.PATCH, res, await serviceFactory.get('messages').update(buildCriteriaFromEncoded(req.params['criteria']), req.body)));
router.delete('/:criteria', async (req, res) => handleError(HTTPMethodsMap.DELETE, res, await serviceFactory.get('messages').update(buildCriteriaFromEncoded(req.params['criteria']), {deleted_at: new Date().toISOString()})));
router.get('/chats/:criteria', async (req, res) => handleError(HTTPMethodsMap.GET, res, await serviceFactory.get('messages').getChats(buildCriteriaFromEncoded(req.params['criteria']))));
router.put('/chats', async (req, res) => handleError(HTTPMethodsMap.PUT, res, await serviceFactory.get('messages').createChat(req.body)));
router.patch('/chats/:criteria', async (req, res) => handleError(HTTPMethodsMap.PATCH, res, await serviceFactory.get('messages').updateChat(buildCriteriaFromEncoded(req.params['criteria']), req.body)));

export default router;