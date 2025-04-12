import {Controller} from "../../architecture/Controller.js";

export const HTTPMethodsMap = {
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
}

export const HTTPCodesMap = {
    'GET': {
        SUCCESS: 200,
        ERROR: 404
    },
    'PUT': {
        SUCCESS: 201,
        ERROR: 200
    },
    'DELETE': {
        SUCCESS: 204,
        ERROR: 404
    },
    'PATCH': {
        SUCCESS: 200,
        ERROR: 204
    }
}

/**
 * @implements {Controller}
 */
export class CommunityController extends Controller {
    constructor(service) {
        super();
        this.service = service;
    }

    async get(req, res) {
        return this.handleError(
                HTTPMethodsMap.GET, res,
                Object.keys(req.params).length ?
                        await this.service.get(req.params.id) :
                        await this.service.getAll()
        );
    }

    async put(req, res) {
        return this.handleError(HTTPMethodsMap.PUT, res, await this.service.create(req.body))
    }

    async delete(req, res) {
        return this.handleError(HTTPMethodsMap.DELETE, res, await this.service.delete(req.params.id));
    }

    async patch(req, res) {
        return this.handleError(HTTPMethodsMap.PATCH, res, await this.service.update(req.body));
    }

    handleError(method, res, serviceResponse) {
        return res.status(HTTPCodesMap[method][serviceResponse.success ? 'SUCCESS' : 'ERROR']).json({
            message: serviceResponse.message,
            data: serviceResponse.data
        });
    }
}