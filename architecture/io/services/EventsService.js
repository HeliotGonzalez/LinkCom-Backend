import {Service} from "../Service.js";

/**
 * @implements {Service}
 */
export class EventsService extends Service {
    constructor(repository) {
        super();
        this._repository = repository;
    }

    repository() {
        return undefined;
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

    async remove(query) {
        return await this._repository.remove(query);
    }
}