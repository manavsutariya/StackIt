class DynamicError extends Error {
  constructor() {
    super();
    this.name = "BASE_ERROR";
    this.status = 500;
    this.code = "INTERNAL_SERVER_ERROR";
    this.message = "Something went wrong";
    this.context = {};
    this.data = {}

    Error.captureStackTrace(this, this.constructor);
  }

  setErrorDetails(errorDetails) {
    this.name = errorDetails?.name || "BASE_ERROR";
    this.status = errorDetails?.status || 500;
    this.code = errorDetails?.code || "INTERNAL_SERVER_ERROR";
    this.message = errorDetails?.message || "Something went wrong";
    this.context = errorDetails?.context || {};
    this.data = errorDetails?.data || {};
    return this;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  setStatus(status) {
    this.status = status;
    return this;
  }

  setCode(code) {
    this.code = code;
    return this;
  }

  setMessage(message) {
    this.message = message
    return this;
  }

  addContext(contextName, contextValue) {
    this.context[contextName] = contextValue;
    return this;
  }

  setContext(context) {
    this.context = { ...this.context, ...context };
    return this;
  }

  addData(dataName, dataValue) {
    this.data[dataName] = dataValue;
    return this;
  }

  setData(data) {
    this.data = { ...this.data, ...data };
    return this;
  }

  build() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      context: this.context,
      data: this.data,
      context: this.context,
      stack: this.stack,
      timestamp: new Date().toISOString()
    };
  }
}

export default DynamicError;
