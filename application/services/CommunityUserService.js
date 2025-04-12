import {Service} from "../../architecture/Service.js";

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

    async join(id, userID) {
        return await this._repository.create(id, userID);
    }

    async leave(id, userID) {
        return await this._repository.remove(id, userID);
    }

    async members(id) {
        return await this._repository.get(id);
    }
}