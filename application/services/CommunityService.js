import {Service} from "../../architecture/Service.js";

/**
 * @implements {Service}
 */
export class CommunityService extends Service {
    constructor(repository) {
        super();
        this._repository = repository;
    }

    repository() {
        return this._repository;
    }

    async getAll() {
        return await this._repository.getAll();
    }

    async get(id) {
        return await this._repository.get(id);
    }

    async create(parameters) {
        return await this._repository.create(parameters);
    }

    async update(parameters) {
        return await this._repository.update(parameters);
    }
}