/**
 * Next.js 15 API Route Handler
 * This file demonstrates different ways to handle request data and send responses
 * in Next.js App Router API routes.
 */

// Next.js 15 API routes use the Web Request and Response API
export async function GET(request, { params }) {
  // 1. Extracting dynamic route parameters
  // The [id] in the folder name becomes available in params.id
  // In Next.js 15, params is now asynchronous and must be awaited
  const { id } = await params;

  // 2. Extracting query parameters from the URL
  // Example URL: /api/test/123?name=john&age=25&city[]=Mumbai&city[]=Surat&car[colour]=red&car[hasEngine]=true
  const { searchParams } = new URL(request.url);
  
  // Process all query parameters, handling arrays and objects
  const queryParams = {};
  
  // Helper function to parse complex query parameters (arrays and objects)
  const parseQueryParams = (params) => {
    const result = {};
    
    // Iterate through all parameters
    for (const [key, value] of params.entries()) {
      // Check if it's an array or object notation (e.g., city[], car[colour])
      if (key.includes('[') && key.includes(']')) {
        // Handle array notation: city[]=Mumbai or object notation: car[colour]=red
        const mainKey = key.substring(0, key.indexOf('['));
        const subKey = key.substring(key.indexOf('[') + 1, key.indexOf(']'));
        
        // Initialize the main key as object if it doesn't exist
        if (!result[mainKey]) {
          result[mainKey] = subKey === '' ? [] : {};
        }
        
        // Handle array (empty brackets)
        if (subKey === '') {
          if (Array.isArray(result[mainKey])) {
            result[mainKey].push(value);
          }
        } 
        // Handle object (with property name in brackets)
        else {
          // Try to convert boolean strings to actual booleans
          let processedValue = value;
          if (value === 'true') processedValue = true;
          if (value === 'false') processedValue = false;
          
          // Try to convert numeric strings to numbers
          if (!isNaN(value) && value !== '') {
            processedValue = Number(value);
          }
          
          result[mainKey][subKey] = processedValue;
        }
      } else {
        // Handle simple key-value pairs
        result[key] = value;
      }
    }
    
    return result;
  };
  
  // Process all query parameters
  const processedParams = parseQueryParams(searchParams);
  
  // 3. Extracting headers
  const userAgent = request.headers.get('user-agent');
  const contentType = request.headers.get('content-type');
  
  // 4. Extracting cookies
  const cookieHeader = request.headers.get('cookie');
  const cookies = cookieHeader ? 
    Object.fromEntries(
      cookieHeader.split('; ')
        .map(cookie => cookie.split('='))
    ) : {};

  // Example response with all extracted data
  return Response.json({
    message: 'GET request processed successfully',
    routeParams: { id },
    queryParams: processedParams,
    headers: { userAgent, contentType },
    cookies,
  }, {
    status: 200,
    headers: {
      'X-Custom-Header': 'Custom value',
    },
  });
}

export async function POST(request, { params }) {
  // 1. Extracting dynamic route parameters
  // In Next.js 15, params is now asynchronous and must be awaited
  const { id } = await params;

  // 2. Extracting body data
  // Method 1: Using request.json() for JSON data
  let bodyData;
  try {
    bodyData = await request.json();
  } catch (error) {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // 3. Extracting query parameters
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  // Example response with all extracted data
  return Response.json({
    message: 'POST request processed successfully',
    routeParams: { id },
    bodyData,
    queryParams: { category },
  });
}

export async function PUT(request, { params }) {
  // 1. Extracting dynamic route parameters
  // In Next.js 15, params is now asynchronous and must be awaited
  const { id } = await params;

  // 2. Extracting body data
  // Method 2: Using request.formData() for form data
  let formData;
  try {
    formData = await request.formData();
    // Convert FormData to a plain object
    const formDataObj = Object.fromEntries(formData.entries());
    
    // Example response with all extracted data
    return Response.json({
      message: 'PUT request processed successfully',
      routeParams: { id },
      formData: formDataObj,
    });
  } catch (error) {
    // 3. Alternative: Handle if it's JSON data instead
    try {
      const jsonData = await request.json();
      return Response.json({
        message: 'PUT request processed successfully',
        routeParams: { id },
        jsonData,
      });
    } catch (innerError) {
      return Response.json({ 
        error: 'Invalid request body format' 
      }, { 
        status: 400 
      });
    }
  }
}

export async function PATCH(request, { params }) {
  // 1. Extracting dynamic route parameters
  // In Next.js 15, params is now asynchronous and must be awaited
  const { id } = await params;

  // 2. Extracting body data
  // Method 3: Using request.text() for raw text data
  let textData;
  try {
    textData = await request.text();
    
    // Try to parse as JSON if applicable
    let parsedData;
    try {
      parsedData = JSON.parse(textData);
    } catch {
      parsedData = null;
    }

    return Response.json({
      message: 'PATCH request processed successfully',
      routeParams: { id },
      textData,
      parsedData,
    });
  } catch (error) {
    return Response.json({ 
      error: 'Failed to read request body' 
    }, { 
      status: 400 
    });
  }
}

export async function DELETE(request, { params }) {
  // 1. Extracting dynamic route parameters
  // In Next.js 15, params is now asynchronous and must be awaited
  const { id } = await params;

  // 2. Extracting query parameters
  const { searchParams } = new URL(request.url);
  const force = searchParams.get('force') === 'true';

  // Example response demonstrating different response formats
  
  // Example 1: Returning a simple text response
  if (force) {
    return new Response(`Resource ${id} permanently deleted`, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
  
  // Example 2: Returning a JSON response with custom status code
  return Response.json({
    message: `Resource ${id} marked for deletion`,
    success: true,
  }, {
    status: 202, // Accepted
    headers: {
      'X-Deletion-Time': new Date().toISOString(),
    },
  });
}

// Example of handling OPTIONS requests (useful for CORS)
export async function OPTIONS() {
  return new Response(null, {
    status: 204, // No Content
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Example of using searchParams as a prop (Next.js 15 async approach)
export async function SEARCH(request, { searchParams }) {
  // In Next.js 15, searchParams is asynchronous when passed as a prop
  const params = await searchParams;
  
  // Extract query parameters
  const query = params.get('query');
  const page = params.get('page');
  const limit = params.get('limit');
  
  return Response.json({
    message: 'SEARCH request processed successfully',
    searchParams: { query, page, limit },
  });
}

// Additional examples of different response formats

// Example function demonstrating different response formats
export async function HEAD(request, { params }) {
  // In Next.js 15, params is asynchronous and must be awaited
  const { id } = await params;
  
  // HEAD requests should return headers but no body
  return new Response(null, {
    status: 200,
    headers: {
      'X-Resource-Count': '42',
      'X-Resource-Id': id,
      'Last-Modified': new Date().toUTCString(),
    },
  });
}

// Error handling example
export function generateErrorResponse(statusCode, message) {
  const errorResponses = {
    400: { error: message || 'Bad Request', code: 'BAD_REQUEST' },
    401: { error: message || 'Unauthorized', code: 'UNAUTHORIZED' },
    403: { error: message || 'Forbidden', code: 'FORBIDDEN' },
    404: { error: message || 'Not Found', code: 'NOT_FOUND' },
    500: { error: message || 'Internal Server Error', code: 'SERVER_ERROR' },
  };

  const errorBody = errorResponses[statusCode] || 
    { error: message || 'Unknown Error', code: 'UNKNOWN_ERROR' };

  return Response.json(errorBody, { status: statusCode });
}