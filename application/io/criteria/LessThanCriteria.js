import {Criteria} from "../../../architecture/io/criteria/Criteria.js";

/**
 * @implements {Criteria}
 */
export class LessThanCriteria extends Criteria {
    constructor(key, value = []) {
        super();
        this.key = key;
        this.value = value;
    }

    apply(query) {
        return query.in(this.key, this.value);
    }
}