import {Criteria} from "../../../architecture/io/criteria/Criteria.js";

/**
 * @implements {Criteria}
 */
export class OrCriteria extends Criteria {
    constructor(key, value) {
        super();
        this.key = key;
        this.value = value;
    }

    apply(query) {
        return query.or(this.value);
    }
}