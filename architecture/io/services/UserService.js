import {Service} from "../Service.js";

/**
 * @implements {Service}
 */
export class UserService extends Service {

    constructor(factory) {
        super(factory);
    }

    async get(criteria)  {
        return await this.factory.get('Users').get(criteria);
    }

    async communities(criteria) {
        return await this.factory.get('CommunityUser').getWithJoin('Communities', criteria);
    }
}