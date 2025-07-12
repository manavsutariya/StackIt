import ServiceRegistry from "./ServiceRegistry.js";
import HttpClientAdapter from "./HttpClientAdapter.js";
import ApiEndpointBuilder from "./ApiEndpointBuilder.js";

class ApiService {
  constructor() {
    this.registry = new ServiceRegistry();
    this.httpClient = new HttpClientAdapter();
    this.endpointBuilder = new ApiEndpointBuilder();
    this.serviceProxies = new Map();
  }

  // Configure the service
  configure(config) {
    this.registry.configure(config);
    return this;
  }

  // Register a service with its endpoints
  registerService(serviceName, endpoints) {
    this.registry.registerService(serviceName, endpoints);
    this.createServiceProxy(serviceName);
    return this;
  }

  // Set authentication
  setAuth(token, type = "Bearer") {
    this.registry.setAuth(token, type);
    return this;
  }

  // Get endpoint builder for manual endpoint creation
  endpoint() {
    return this.endpointBuilder;
  }

  // Create dynamic service proxy
  createServiceProxy(serviceName) {
    const service = this.registry.getService(serviceName);
    const proxy = {};

    for (const [methodName, endpoint] of Object.entries(service)) {
      proxy[methodName] = async (data = {}, options = {}) => {
        return await this.executeRequest(endpoint, data, options);
      };
    }

    this.serviceProxies.set(serviceName, proxy);

    // Make service accessible as property
    Object.defineProperty(this, serviceName, {
      get: () => this.serviceProxies.get(serviceName),
      enumerable: true,
      configurable: true,
    });
  }

  // Execute a request
  async executeRequest(endpoint, data, options) {
    // Validate data if validator exists

    // Build request config
    const requestConfig = endpoint(data, options);
    
    // console.log("config", requestConfig)
    
    // Add global configuration
    requestConfig.url = this.buildFullUrl(requestConfig.url);
    
    requestConfig.headers = {
      ...this.registry.globalConfig.defaultHeaders,
      ...requestConfig.headers,
    };
    
    // Add auth if required
    if (requestConfig.auth && this.registry.globalConfig.auth.token) {
      requestConfig.headers.Authorization = `${this.registry.globalConfig.auth.type} ${this.registry.globalConfig.auth.token}`;
    }

    // console.log("Semi Final config", requestConfig)
    
    // Add cache and timeout
    // requestConfig.cache = endpoint.cache;
    // requestConfig.timeout = endpoint.timeout;

    // Execute request
    const response = await this.httpClient.execute(requestConfig);

    // Transform response if transformer exists
    // return endpoint.transform ? endpoint.transform(response) : response;
    return response;
  }

  buildFullUrl(url) {
    // console.log(this.registry.globalConfig.baseUrl, url)
    return `${this.registry.globalConfig.baseUrl}${url}`;
  }

  // Get all available services
  getAvailableServices() {
    return this.registry.getAllServices();
  }
}

export default ApiService;
