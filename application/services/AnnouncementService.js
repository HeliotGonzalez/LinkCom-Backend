import { Service } from "../../architecture/model/Service.js";

export class AnnouncementService extends Service {
  constructor(repository) {
    super();
    this._repository = repository;
  }

  // Por convención, si necesitas acceder al repositorio:
  repository() {
    return this._repository;
  }

  async create(parameters) {
    // "parameters" contendrá {title, body, communityID, publisherID, ...}
    return await this._repository.create(parameters);
  }

  async get(query) {
    // Ejemplo: { id: "..." } para uno, o vacío para todos
    //         { communityID: "..." } para filtrar por comunidad, etc.
    return await this._repository.get(query);
  }

  async update(query, parameters) {
    // query: { id: '...' }
    // parameters: { title: 'nuevo', body: 'nuevo', ... }
    return await this._repository.update(query, parameters);
  }

  async delete(query) {
    // query: { id: '...' }
    return await this._repository.remove(query);
  }
}
