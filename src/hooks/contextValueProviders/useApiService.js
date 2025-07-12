"use client"

import ApiServiceContext from "@/contexts/ApiServiceContext";
import { useContext } from "react";

// Custom hook to use ApiService
const useApiService = () => {
    const context = useContext(ApiServiceContext);
    if (!context) {
        throw new Error("useApiService must be used within ApiServiceProvider");
    }
    return context;
};

export { useApiService };