class FileErrorHandler {
  handle(error) {
    console.error('[FILE LOG]', error.toJSON());
  }
}

export default FileErrorHandler;