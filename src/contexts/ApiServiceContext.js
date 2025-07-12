"use client";

import ApiService from "@/utils/apiServices/ApiService";
import { createContext, useContext } from "react";

// Create the context
const ApiServiceContext = createContext(null);

// Create the provider component
export const ApiServiceProvider = ({ children }) => {
  const apiService = new ApiService();

  return (
    <ApiServiceContext.Provider value={apiService}>
      {children}
    </ApiServiceContext.Provider>
  );
};

// Export the context
export default ApiServiceContext;


