class ServiceRegistry {
  constructor() {
    this.services = new Map();
    this.globalConfig = {
      baseUrl: '',
      defaultHeaders: {},
      auth: {
        token: null,
        type: 'Bearer'
      },
      interceptors: {
        request: [],
        response: []
      }
    };
  }

  configure(config) {
    this.globalConfig = { ...this.globalConfig, ...config };
    return this;
  }

  registerService(name, serviceDefinition) {
    this.services.set(name, serviceDefinition);
    return this;
  }

  getService(name) {
    return this.services.get(name);
  }

  getAllServices() {
    return Array.from(this.services.keys());
  }

  setAuth(token, type = 'Bearer') {
    this.globalConfig.auth = { token, type };
    return this;
  }

  addRequestInterceptor(interceptor) {
    this.globalConfig.interceptors.request.push(interceptor);
    return this;
  }

  addResponseInterceptor(interceptor) {
    this.globalConfig.interceptors.response.push(interceptor);
    return this;
  }
}

export default ServiceRegistry;