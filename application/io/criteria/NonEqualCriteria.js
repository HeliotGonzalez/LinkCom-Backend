import {Criteria} from "../../../architecture/io/criteria/Criteria.js";

/**
 * @implements {Criteria}
 */
export class NonEqualCriteria extends Criteria {
    constructor(key, value) {
        super();
        this.key = key;
        this.value = value;
    }

    apply(query) {
        return query.neq(this.key, this.value);
    }
}