import {Criteria} from "../../../architecture/io/criteria/Criteria.js";

/**
 * @implements {Criteria}
 */
export class PaginationCriteria extends Criteria {
    constructor(limit, offset) {
        super();
        this.limit = limit;
        this.offset = offset;
    }

    apply(query) {
        return query.range(this.offset, this.offset + this.limit - 1);
    }
}