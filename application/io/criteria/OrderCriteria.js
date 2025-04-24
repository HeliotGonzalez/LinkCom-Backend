import {Criteria} from "../../../architecture/io/criteria/Criteria.js";

/**
 * @implements {Criteria}
 */
export class OrderCriteria extends Criteria {
    constructor(key, value) {
        super();
        this.key = key;
        this.value = value;
    }

    apply(query) {
        return query.order(this.key, { ascending: this.value });
    }
}