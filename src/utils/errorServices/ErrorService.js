import ErrorTypeRegistry from './ErrorTypeRegistry.js';
import ErrorBuilder from './ErrorBuilder.js';
import ConsoleErrorHandler from './ConsoleErrorHandler.js';
import ConsoleError from './ConsoleErrorHandler.js';

class ErrorService {
  constructor() {
    this.registry = ErrorTypeRegistry.getInstance();
    this.consoleErrorHandler = new ConsoleError();
  }

  static getInstance() {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  setupDefaultHandlers() {
    this.manager.addHandler(new ConsoleErrorHandler());
  }

  configureErrorType(config) {
    this.registry.registerErrorType(config);
  }

  get createError() {
    const error = new ErrorBuilder();
    return error;
  }

  throwError(error) {
    throw error;
  }

  cleanError(error) {
    delete error.name
    delete error.context
    delete error.stack
    return error
  }

  consoleError(error, showStack) {
    this.consoleErrorHandler.handleError(error, showStack);
  }

  getErrorTypes() {
    return this.registry.getAllErrorTypes();
  }
}

export default ErrorService;
