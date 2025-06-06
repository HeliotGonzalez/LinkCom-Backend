export const HTTPMethodsMap = {
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
}

export const HTTPCodesMap = {
    'GET': {
        SUCCESS: 200,
        ERROR: 404
    },
    'PUT': {
        SUCCESS: 201,
        ERROR: 400
    },
    'DELETE': {
        SUCCESS: 200,
        ERROR: 404
    },
    'PATCH': {
        SUCCESS: 200,
        ERROR: 400
    }
}