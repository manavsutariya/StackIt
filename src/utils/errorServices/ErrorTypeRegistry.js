class ErrorTypeRegistry {
  static instance;

  constructor() {
    this.errorTypes = new Map();
  }

  static getInstance() {
    if (!ErrorTypeRegistry.instance) {
      ErrorTypeRegistry.instance = new ErrorTypeRegistry();
    }
    return ErrorTypeRegistry.instance;
  }

  registerErrorType(config) {
    this.errorTypes.set(config.name, config);
  }

  getErrorType(typeName) {
    return this.errorTypes.get(typeName);
  }

  getAllErrorTypes() {
    return Object.fromEntries(this.errorTypes);
  }

  hasErrorType(typeName) {
    return this.errorTypes.has(typeName);
  }
}

export default ErrorTypeRegistry;