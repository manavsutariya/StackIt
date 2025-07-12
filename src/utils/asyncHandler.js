import errorService from "./errorService";
import responseService from "./responseService";

const asyncHandler = (fn) => async (request) => {
    try {
        return await fn(request);
    } catch (error) {
        console.log(error)
        const finalError = errorService.createError
            .setErrorType("API_ERROR")
            .setStatus(error?.status || 500)
            .setCode(error?.code || "INTERNAL_SERVER_ERROR")
            .setMessage(error?.message || "Something went wrong")
            .setContext(error?.context || {})
            .setData(error?.data || {})
            .build()

        errorService.consoleError(finalError, true)

        const responseError = errorService.cleanError(finalError)

        const responseData = responseService.createResponseData
            .setData({
                success: false,
                successDetails: {},
                errorDetails: responseError
            })
            .setStatus(responseError.status)
            .setHeaders({
                "Content-type": "application/json"
            })

        return responseService.generateResponse(responseData)
    }
}

export default asyncHandler;