// ==================== API CONFIGURATION ====================

// Builder Pattern - API endpoint builder

class ApiEndpointBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.endpoint = {
      url: '',
      method: 'GET',
      auth: false,
      validate: null,
      transform: null,
      cache: false,
      timeout: 30000
    };
    return this;
  }

  setUrl(url) {
    this.endpoint.url = url;
    return this;
  }

  setMethod(method) {
    this.endpoint.method = method.toUpperCase();
    return this;
  }

  requireAuth(required = true) {
    this.endpoint.auth = required;
    return this;
  }

  setValidation(validator) {
    this.endpoint.validate = validator;
    return this;
  }

  setTransform(transformer) {
    this.endpoint.transform = transformer;
    return this;
  }

  enableCache(ttl = 300000) {
    this.endpoint.cache = ttl;
    return this;
  }

  setTimeout(timeout) {
    this.endpoint.timeout = timeout;
    return this;
  }

  build() {
    const result = { ...this.endpoint };
    this.reset();
    return result;
  }
}

export default ApiEndpointBuilder