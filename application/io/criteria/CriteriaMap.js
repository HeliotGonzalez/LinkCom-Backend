import {EqualCriteria} from "./EqualCriteria.js";
import {NonEqualCriteria} from "./NonEqualCriteria.js";
import {GreaterThanCriteria} from "./GreaterThanCriteria.js";
import {LessThanCriteria} from "./LessThanCriteria.js";
import {NotInCriteria} from "./NotInCriteria.js";

const criteriaMap = {
    eq: EqualCriteria,
    neq: NonEqualCriteria,
    gt: GreaterThanCriteria,
    lt: LessThanCriteria,
    nin: NotInCriteria
};

export default criteriaMap;