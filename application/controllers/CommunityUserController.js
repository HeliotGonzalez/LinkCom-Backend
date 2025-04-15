import { Controller } from "../../architecture/control/Controller.js";
import { HTTPCodesMap, HTTPMethodsMap } from "../utils/HTTPUtils.js";

/**
 * @implements {Controller}
 */
export class CommunityUserController extends Controller {
    constructor(service) {
        super();
        this.service = service;
    }

    async put(req, res) {
        return this.handleError(
            HTTPMethodsMap.PUT,
            res,
            await this.service.join({ ...req.body, communityID: req.params.communityID })
        );
    }

    async get(req, res) {
        return this.handleError(
            HTTPMethodsMap.GET,
            res,
            await this.service.members({ ...req.query, communityID: req.params.communityID })
        );
    }

    async patch(req, res) {
        return this.handleError(
            HTTPMethodsMap.PATCH,
            res,
            await this.service.changeRole({ ...req.query, communityID: req.params.communityID }, req.body)
        );
    }

    async delete(req, res) {
        return this.handleError(
            HTTPMethodsMap.DELETE,
            res,
            await this.service.leave({ userID: req.params.userID, communityID: req.params.communityID })
        );
    }

    /**
     * Endpoint para que un usuario se una a una comunidad.
     */
    async joinCommunity(req, res) {
        const { userID, communityID } = req.body;
        if (!userID || !communityID) {
            return res.status(400).json({ error: 'userID y communityID son requeridos' });
        }
    
        // Llama a la función "join" en el servicio, ya que es la que existe
        console.log('Servicio: ', this.service);
        const result = await this.service.joinCommunity({ userID, communityID });
        if (!result.success) {
            return res.status(500).json({ error: result.error });
        }
    
        return res.status(201).json({
            message: 'El usuario se ha unido a la comunidad correctamente',
            data: result.data
        });
    }

    handleError(method, res, serviceResponse) {
        return res.status(HTTPCodesMap[method][serviceResponse.success ? 'SUCCESS' : 'ERROR']).json({
            message: serviceResponse.message,
            data: serviceResponse.data
        });
    }
}