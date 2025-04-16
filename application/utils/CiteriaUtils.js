import {HTTPCodesMap} from "./HTTPUtils.js";
import {CriteriaBuilder} from "../../architecture/io/CriteriaBuilder.js";
import criteriaMap from "../io/criteria/CriteriaMap.js";
import {CriteriaBuilderFactory} from "../../architecture/io/CriteriaBuilderFactory.js";

export const handleError = (method, res, serviceResponse) => {
    return res.status(HTTPCodesMap[method][serviceResponse.success ? 'SUCCESS' : 'ERROR']).json({
        message: serviceResponse.message,
        data: serviceResponse.data
    });
}

export const buildCriteriaFrom = (criteriaFromQuery) => {
    criteriaFromQuery = Object.fromEntries(Object.entries(criteriaFromQuery).filter(([key, value]) => value));
    const criteria = [];
    Object.keys(criteriaFromQuery).forEach(k => {
        const criterion = criteriaFromQuery[k].includes('%') ? criteriaFromQuery[k].split('%') : ['eq', criteriaFromQuery[k]];
        criteria.push(builderFactory.get(criterion[0])(k, criterion[1]).build());
    });
    return criteria;
}

export const builderFactory = new CriteriaBuilderFactory();
builderFactory.put(
    'eq',
    (key, value) => CriteriaBuilder.create().withCriterion(criteriaMap.eq).withKey(key).withValue(value)
);
builderFactory.put(
    'neq',
    (key, value) => CriteriaBuilder.create().withCriterion(criteriaMap.neq).withKey(key).withValue(value)
);
builderFactory.put(
    'nin',
    (key, value) => CriteriaBuilder.create().withCriterion(criteriaMap.nin).withKey(key).withValue(value)
)