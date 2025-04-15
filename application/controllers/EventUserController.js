import {Controller} from "../../architecture/control/Controller.js";
import {HTTPCodesMap, HTTPMethodsMap} from "../utils/HTTPUtils.js";

/**
 * @implements {Controller}
 */
export class EventUserController extends Controller {
    constructor(service) {
        super();
        this.service = service;
    }

    async put(req, res) {
        return this.handleError(HTTPMethodsMap.PUT, res, await this.service.join({...req.body, eventID: req.params.eventID, userID: req.params.userID}));
    }

    async get(req, res) {
        return this.handleError(HTTPMethodsMap.GET, res, await this.service.members({...req.query, eventID: req.params.eventID}));
    }

    async patch(req, res) {
        throw new Error('Method not implemented');
    }

    async delete(req, res) {
        return this.handleError(HTTPMethodsMap.DELETE, res, await this.service.leave({...req.query, eventID: req.params.eventID, userID: req.params.userID}));
    }

    handleError(method, res, serviceResponse) {
        return res.status(HTTPCodesMap[method][serviceResponse.success ? 'SUCCESS' : 'ERROR']).json({
            message: serviceResponse.message,
            data: serviceResponse.data
        });
    }
}