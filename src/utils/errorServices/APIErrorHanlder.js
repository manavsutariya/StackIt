export default class APIErrorHandler {
  handle(error) {
    console.error('[API LOG]', error.toJSON());
  }
}