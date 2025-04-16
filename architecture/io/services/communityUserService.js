import {Service} from "../Service.js";

/**
 * @implements {Service}
 */
export class CommunityUserService extends Service {
    constructor(repository) {
        super();
        this._repository = repository;
    }

    repository() {
        return this._repository;
    }

    async join(parameters) {
        return await this._repository.create(parameters);
    }

    async members(query) {
        return await this._repository.get(query);
    }

    async changeRole(query, parameters) {
        return await this._repository.update(query, parameters);
    }

    async leave(query) {
        return await this._repository.remove(query);
    }
}