import DynamicError from "./DynamicError.js";
import ErrorTypeRegistry from "./ErrorTypeRegistry.js";

class ErrorBuilder {
  constructor() {
    this.registry = ErrorTypeRegistry.getInstance();
  }

  getErrorTypeConfiguration(errorType) {
    const errorTypeConfiguration = this.registry.getErrorType(errorType)
    return errorTypeConfiguration
  }

  setErrorType(errorType) {
    const errorTypeConfiguration = this.getErrorTypeConfiguration(errorType)
    let error = new DynamicError()

    if (errorTypeConfiguration) {
      error = new DynamicError().setErrorDetails(errorTypeConfiguration)
    }

    return error;
  }
}

export default ErrorBuilder;