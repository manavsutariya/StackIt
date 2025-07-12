const fetchError = {
    name: 'FETCH_ERROR',
    status: 503,
    code: 'FETCH_ERROR',
    message: 'Error occur during fetch',
    context: {
        service: "",
        method: "",
    },
    data: {}
}

export default fetchError;