import {Controller} from "../../architecture/control/Controller.js";
import {HTTPCodesMap, HTTPMethodsMap} from "../utils/HTTPUtils.js";

/**
 * @implements {Controller}
 */
export class CommunityController extends Controller {
    constructor(service) {
        super();
        this.service = service;
    }

    async put(req, res) {
        return this.handleError(HTTPMethodsMap.PUT, res, await this.service.create(req.body))
    }

    async get(req, res) {
        return this.handleError(HTTPMethodsMap.GET, res, await this.service.get(!req.params.id ? req.query : {...req.query, id: req.params.id}));
    }

    async patch(req, res) {
        return this.handleError(HTTPMethodsMap.PATCH, res, await this.service.update({...req.query, id: req.params.id}, req.body));
    }

    async delete(req, res) {
        return this.handleError(HTTPMethodsMap.DELETE, res, await this.service.delete({...req.query, id: req.params.id}));
    }

    handleError(method, res, serviceResponse) {
        return res.status(HTTPCodesMap[method][serviceResponse.success ? 'SUCCESS' : 'ERROR']).json({
            message: serviceResponse.message,
            data: serviceResponse.data
        });
    }
}