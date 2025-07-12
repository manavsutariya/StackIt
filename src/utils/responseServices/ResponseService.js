import { NextResponse } from 'next/server';
import ResponseDataBuilder from './ResponseDataBuilder';

class ResponseService {
  static instance;

  static getInstance() {
    if (!ResponseService.instance) {
      ResponseService.instance = new ResponseService();
    }
    return ResponseService.instance;
  }

  get createResponseData() {
    return new ResponseDataBuilder();
  }

  generateResponse(responseData) {
    return NextResponse.json(
      responseData?.data || {},
      {
        status: responseData?.status || 500,
        headers: responseData?.headers || {}
      }
    )
  }
}

export default ResponseService;