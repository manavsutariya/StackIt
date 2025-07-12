export default class ConsoleErrorHandler {
  handleError(error, showStack) {
    console.log("=====================Error Details=====================");
    console.error({
      name: error.name,
      status: error.status,
      code: error.code,
      message: error.message,
      context: error.context,
      data: error.data,
      stack: showStack ? error.stack : null
    });
  }
}