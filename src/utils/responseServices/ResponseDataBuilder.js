class ResponseDataBuilder {
  constructor() {
    this.data = {};
    this.status = null;
    this.headers = {};
  }

  setSuccess(success) {
    this.data.success = success;
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

  setStatus(status) {
    this.status = status;
    return this;
  }

  setHeader(key, value) {
    this.headers[key] = value;
    return this;
  }

  setHeaders(headers) {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  setResponse(response) {
    this.data = response.data;
    this.status = response.status;
    this.headers = response.headers;
    return this
  }

  removeResponse(responseName) {
    delete this.response[responseName];
    return this;
  }

  getResponse() {
    return this.response;
  }

  getStatus() {
    return this.statusCode;
  }

  getHeaders() {
    return this.headers;
  }

  build() {
    return {
      data: this.data,
      status: this.status,
      headers: this.headers
    };
  }
}

export default ResponseDataBuilder;