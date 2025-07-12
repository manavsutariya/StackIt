// Request builder class - Encapsulates request configuration
class HttpRequest {
  constructor() {
    this.url = "";
    this.method = "GET";
    this.headers = {};
    this.params = {};
    this.body = null;
    this.requireAuth = false;
  }

  setUrl(url) {
    this.url = url;
    return this;
  }

  setMethod(method) {
    this.method = method.toUpperCase();
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

  setParams(params) {
    this.params = params;
    return this;
  }

  setBody(body) {
    this.body = body;
    return this;
  }

  setRequireAuth(require = true) {
    this.requireAuth = require;
    return this;
  }

  // Alias for send() for better readability
  build() {
    return {
      url: this.url,
      method: this.method,
      headers: this.headers,
      params: this.params,
      data: this.body,
      requireAuth: this.requireAuth,
    };
  }
}

export default HttpRequest;
