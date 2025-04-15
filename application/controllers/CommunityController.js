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

    async getNonBelongingCommunities(req, res) {
        const { userId } = req.query;
        if (!userId) {
          return res.status(400).json({ error: 'El parámetro userId es requerido' });
        }
    
        try {
          const communities = await this.service.getNonBelongingCommunities(userId);
          return res.json(communities);
        } catch (error) {
          console.error('Error al obtener comunidades:', error);
          return res.status(500).json({ error: error.message });
        }
      }
    
      handleError(method, res, serviceResponse) {
        return res
          .status(HTTPCodesMap[method][serviceResponse.success ? 'SUCCESS' : 'ERROR'])
          .json({
            message: serviceResponse.message,
            data: serviceResponse.data
          });
      }
}