import {HTTPCodesMap} from "./HTTPUtils.js";
import {CriteriaBuilder} from "../../architecture/io/criteria/CriteriaBuilder.js";
import criteriaMap from "../io/criteria/CriteriaMap.js";
import {CriteriaBuilderFactory} from "../../architecture/io/criteria/CriteriaBuilderFactory.js";

export const handleError = (method, res, serviceResponse) => {
    return res.status(HTTPCodesMap[method][serviceResponse.success ? 'SUCCESS' : 'ERROR']).json({
        message: serviceResponse.success ? serviceResponse.message : serviceResponse.error,
        data: serviceResponse.data
    });
}

export const buildCriteriaFrom = (criteriaFromQuery) => {
    criteriaFromQuery = Object.fromEntries(Object.entries(criteriaFromQuery).filter(([key, value]) => value));
    const criteria = [];
    Object.keys(criteriaFromQuery).forEach(k => {
        const criterion = criteriaFromQuery[k].includes(';') ? criteriaFromQuery[k].split(';') : ['eq', criteriaFromQuery[k]];
        criteria.push(builderFactory.get(criterion[0])(k, criterion[1]).build());
    });
    return criteria;
}

export const buildCriteriaFromEncoded = (raw) => {
    if (!raw) return [];
    const criteria = JSON.parse(atob(raw));
    let filters = [...criteria.filters].map(f => isFilterGroup(f) ?
        builderFactory.get(f.logic)('', buildCriteriaGroupString(f)).build() :
        builderFactory.get(f.operator.value)(f.field, f.value).build());
    if (criteria.order) filters.push(builderFactory.get('order')(criteria.order.field, criteria.order.direction).build());
    return filters;
}

const isFilterGroup = (filter) => {
    return 'logic' in filter;
}

const buildCriteriaGroupString = (group) => {
    return group.logic === '&&' ? buildAndString(group.filters) : buildOrString(group.filters);
}

const buildAndString = (filters) => {
    return `and(${filters.map(f => isFilterGroup(f) ? buildCriteriaGroupString(f) : `${f.field}.${f.operator.value}.${f.value}`).join(',')})`;
}

const buildOrString = (filters) => {
    return filters.map(f => isFilterGroup(f) ? buildCriteriaGroupString(f) : `${f.field}.${f.operator.value}.${f.value}`).join(',');
}

export const builderFactory = new CriteriaBuilderFactory();
builderFactory
    .put(
        'eq',
        (key, value) => CriteriaBuilder.create().withCriterion(criteriaMap.eq).withKey(key).withValue(value)
    )
    .put(
        'neq',
        (key, value) => CriteriaBuilder.create().withCriterion(criteriaMap.neq).withKey(key).withValue(value)
    )
    .put(
        'nin',
        (key, value) => CriteriaBuilder.create().withCriterion(criteriaMap.nin).withKey(key).withValue(value)
    )
    .put(
        'pagination',
        (limit, offset) => CriteriaBuilder.create().withCriterion(criteriaMap.pagination).withKey(limit).withValue(offset)
    )
    .put(
        'in',
        (key, value) => CriteriaBuilder.create().withCriterion(criteriaMap.in).withKey(key).withValue(value)
    )
    .put(
        'limit',
        (key, value) => CriteriaBuilder.create().withCriterion(criteriaMap.limit).withKey(key).withValue(value)
    )
    .put(
        'order',
        (key, value) => CriteriaBuilder.create().withCriterion(criteriaMap.order).withKey(key).withValue(value)
    )
    .put(
        'or',
        (key, value) => CriteriaBuilder.create().withCriterion(criteriaMap.or).withKey(key).withValue(value)
    )
    .put(
        '||',
        (key, value) => CriteriaBuilder.create().withCriterion(criteriaMap.or).withKey(key).withValue(value)
    )