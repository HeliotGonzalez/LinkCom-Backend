import {Criteria} from "../../../architecture/io/criteria/Criteria.js";

/**
 * @implements {Criteria}
 */
export class InCriteria extends Criteria {
    constructor(key, value) {
        super();
        this.key = key;
        this.value = value;
    }

    apply(query) {
        return query.in(this.key, !Array.isArray(this.value) ? this.value.split(',') : this.value);
    }
}
