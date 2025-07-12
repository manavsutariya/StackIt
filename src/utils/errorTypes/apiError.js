const apiError = {
    name: 'API_ERROR',
    status: 500,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'API request failed',
    context: {
        endpoint: '',
        method: ''
    },
    data: {}
}

export default apiError;