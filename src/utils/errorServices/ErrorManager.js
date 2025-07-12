class ErrorManager {
  static instance;
  handlers = [];

  constructor() { }

  static getInstance() {
    if (!ErrorManager.instance) {
      ErrorManager.instance = new ErrorManager();
    }
    return ErrorManager.instance;
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  removeHandler(handler) {
    const index = this.handlers.indexOf(handler);
    if (index > -1) {
      this.handlers.splice(index, 1);
    }
  }

  handleError(error) {
    this.handlers.forEach(handler => handler.handle(error));
  }
}

// Export ErrorManager as default
export default ErrorManager;