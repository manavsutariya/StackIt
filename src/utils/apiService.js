import ApiService from "./apiServices/ApiService.js";
import authServiceDefination from "./apiServiceDefinations/authServiceDefination.js";

// ==================== SETUP AND USAGE ====================

// Create and configure the API service

const apiService = new ApiService();

// Configure global settings
apiService.configure({
  baseUrl: 'http://localhost:3000',
  defaultHeaders: {
    'Content-Type': 'application/json',
  }
});

// Register services
apiService
  .registerService('auth', authServiceDefination)


// Set authentication
// apiHandler.setAuth('Manav');

export default apiService;