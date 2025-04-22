import {EqualCriteria} from "./EqualCriteria.js";
import {NonEqualCriteria} from "./NonEqualCriteria.js";
import {GreaterThanCriteria} from "./GreaterThanCriteria.js";
import {LessThanCriteria} from "./LessThanCriteria.js";
import {NotInCriteria} from "./NotInCriteria.js";
import {PaginationCriteria} from "./PaginationCriteria.js";
import {InCriteria} from "./InCriteria.js";

const criteriaMap = {
    eq: EqualCriteria,
    neq: NonEqualCriteria,
    gt: GreaterThanCriteria,
    lt: LessThanCriteria,
    in: InCriteria,
    nin: NotInCriteria,
    pagination: PaginationCriteria
};

export default criteriaMap;