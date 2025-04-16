import {Criteria} from "../../../architecture/io/Criteria.js";

/**
 * @implements {Criteria}
 */
export class EqualCriteria extends Criteria {
    constructor(key, value) {
        super();
        this.key = key;
        this.value = value;
    }

    apply(query) {
        return query.eq(this.key, this.value);
    }
}