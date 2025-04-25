import {Criteria} from "../../../architecture/io/criteria/Criteria.js";

/**
 * @implements {Criteria}
 */
export class LimitCriteria extends Criteria {
    constructor(limit) {
        super();
        this.limit = limit;
    }

    apply(query) {
        return query.limit(this.limit);
    }
}