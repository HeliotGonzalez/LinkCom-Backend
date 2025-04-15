import {Service} from "../../architecture/model/Service.js";

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

    async create(parameters) {
        return await this._repository.create(parameters);
    }

    async get(query) {
        return await this._repository.get(query);
    }

    async update(query, parameters) {
        return await this._repository.update(query, parameters);
    }

    async delete(query) {
        return await this._repository.remove(query);
    }
}