import {Controller} from "../../architecture/control/Controller.js";
import {HTTPCodesMap, HTTPMethodsMap} from "../utils/HTTPUtils.js";

/**
 * @implements {Controller}
 */
export class CommunityUserController extends Controller {
    constructor(service) {
        super();
        this.service = service;
    }

    async put(req, res) {
        return this.handleError(HTTPMethodsMap.PUT, res, await this.service.join({...req.body, communityID: req.params.communityID}));
    }

    async get(req, res) {
        return this.handleError(HTTPMethodsMap.GET, res, await this.service.members({...req.query, communityID: req.params.communityID}));
    }

    async patch(req, res) {
        return this.handleError(HTTPMethodsMap.PATCH, res, await this.service.changeRole({...req.query, communityID: req.params.communityID}, req.body));
    }

    async delete(req, res) {
        return this.handleError(HTTPMethodsMap.DELETE, res, await this.service.leave({userID: req.params.userID, communityID: req.params.communityID}));
    }

    handleError(method, res, serviceResponse) {
        return res.status(HTTPCodesMap[method][serviceResponse.success ? 'SUCCESS' : 'ERROR']).json({
            message: serviceResponse.message,
            data: serviceResponse.data
        });
    }
}