import {Criteria} from "../../../architecture/io/Criteria.js";

/**
 * @implements {Criteria}
 */
export class NotInCriteria extends Criteria {
    constructor(key, value) {
        super();
        this.key = key;
        this.value = value;
    }

    apply(query) {
        return query.not(this.key, 'in', `(${this.value.join(',')})`)
    }
}