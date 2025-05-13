import { Controller } from "../../architecture/control/Controller.js";
import { HTTPCodesMap, HTTPMethodsMap } from "../utils/HTTPUtils.js";

/**
 * @implements {Controller}
 */
export class AnnouncementController extends Controller {
  constructor(service) {
    super();
    this.service = service;
  }

  async put(req, res) {
    // Crea (inserta) un nuevo Announcement
    const response = await this.service.create(req.body);
    return this.handleError(HTTPMethodsMap.PUT, res, response);
  }

  async get(req, res) {
    // Obtiene uno o varios Announcements
    // - si viene req.params.id => uno
    // - si no => todos (o filtrados por query)
    const query = !req.params.id
      ? req.query
      : { ...req.query, id: req.params.id };

    const response = await this.service.get(query);
    return this.handleError(HTTPMethodsMap.GET, res, response);
  }

  async patch(req, res) {
    // Actualiza un Announcement según su :id
    const query = { ...req.query, id: req.params.id };
    const response = await this.service.update(query, req.body);
    return this.handleError(HTTPMethodsMap.PATCH, res, response);
  }

  async delete(req, res) {
    // Elimina un Announcement según su :id
    const query = { ...req.query, id: req.params.id };
    const response = await this.service.delete(query);
    return this.handleError(HTTPMethodsMap.DELETE, res, response);
  }

  handleError(method, res, serviceResponse) {
    return res
      .status(
        HTTPCodesMap[method][serviceResponse.success ? "SUCCESS" : "ERROR"]
      )
      .json({
        message: serviceResponse.message,
        data: serviceResponse.data,
      });
  }
}
