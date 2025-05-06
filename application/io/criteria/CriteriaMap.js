import {EqualCriteria} from "./EqualCriteria.js";
import {NonEqualCriteria} from "./NonEqualCriteria.js";
import {GreaterThanCriteria} from "./GreaterThanCriteria.js";
import {LessThanCriteria} from "./LessThanCriteria.js";
import {NotInCriteria} from "./NotInCriteria.js";
import {PaginationCriteria} from "./PaginationCriteria.js";
import {InCriteria} from "./InCriteria.js";
import {OrderCriteria} from "./OrderCriteria.js";
import {LimitCriteria} from "./LimitCriteria.js";
import { OrCriteria } from "./OrCriteria.js";

const criteriaMap = {
    eq: EqualCriteria,
    neq: NonEqualCriteria,
    gt: GreaterThanCriteria,
    lt: LessThanCriteria,
    in: InCriteria,
    nin: NotInCriteria,
    pagination: PaginationCriteria,
    order: OrderCriteria,
    limit: LimitCriteria,
    or: OrCriteria
};

export default criteriaMap;