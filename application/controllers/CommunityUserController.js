import {Controller} from "../../architecture/Controller.js";
import {HTTPCodesMap, HTTPMethodsMap} from "./CommunityController.js";

/**
 * @implements {Controller}
 */
export class CommunityUserController extends Controller {
    constructor(service) {
        super();
        this.service = service;
    }

    async get(req, res) {
        return this.handleError(
                HTTPMethodsMap.GET, res,
                req.params ?
                        await this.service.members(req.params.id) :
                        await this.service.getAll()
        );
    }

    async put(req, res) {
        return this.handleError(HTTPMethodsMap.GET, res, await this.service.join(req.params.id, req.body.userID));
    }

    async delete(req, res) {
        return this.handleError(HTTPMethodsMap.GET, res, await this.service.leave(req.params.id, req.body.userID));
    }

    async patch(req, res) {
        return this.handleError(HTTPMethodsMap.GET, res, await this.service.update(req.params.id, req.body.role));
    }

    handleError(method, res, serviceResponse) {
        return res.status(HTTPCodesMap[method][serviceResponse.success ? 'SUCCESS' : 'ERROR']).json({
            message: serviceResponse.message,
            data: serviceResponse.data
        });
    }
}