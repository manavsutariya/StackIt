import ErrorService from "./errorServices/ErrorService.js";

import apiError from "./errorTypes/apiError.js";
import fetchError from "./errorTypes/fetchError.js";

const errorService = ErrorService.getInstance();

errorService.configureErrorType(apiError)
errorService.configureErrorType(fetchError)

export default errorService;
