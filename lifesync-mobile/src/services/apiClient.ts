import { Platform } from "react-native";
import Constants from "expo-constants";

// Auto-detect the local developer's machine IP address for local testing on emulators and physical devices
const getBaseUrl = () => {
  if (__DEV__) {
    // expoConfig or manifest2 contains the local dev server URI (e.g. 192.168.1.5:8081)
    const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.developer?.projectUrl;
    if (hostUri) {
      const ip = hostUri.split(":")[0];
      return `http://${ip}:5000`; // Connects to local backend running on port 5000 of developer machine
    }
    // Fallback if expo hostUri is unavailable
    return Platform.OS === "android" ? "http://10.0.2.2:5000" : "http://localhost:5000";
  }
  
  // Production Endpoint
  return "https://api.lifesync.ai"; // Replace with your production API URL
};

export const BASE_URL = getBaseUrl();
console.log(`[API_CLIENT] Initialized with Base URL: ${BASE_URL}`);

// Client memory state for Auth tokens
let _accessToken: string | null = null;
let _refreshToken: string | null = null;

/**
 * Save JWT tokens to memory
 */
export const setTokens = (accessToken: string | null, refreshToken: string | null) => {
  _accessToken = accessToken;
  _refreshToken = refreshToken;
};

export const getAccessToken = () => _accessToken;
export const getRefreshToken = () => _refreshToken;

/**
 * Standard fetch wrapper for making HTTP requests with automatic header handling
 */
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASE_URL}/api${endpoint}`;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Automatically inject JWT token if it exists
  if (_accessToken) {
    headers["Authorization"] = `Bearer ${_accessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data;
};

/**
 * Centralized Authentication API Endpoints
 */
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response?.data?.accessToken) {
      setTokens(response.data.accessToken, response.data.refreshToken || null);
    }
    return response;
  },

  register: async (name: string, email: string, password: string, phone?: string) => {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, phone }),
    });

    if (response?.data?.accessToken) {
      setTokens(response.data.accessToken, response.data.refreshToken || null);
    }
    return response;
  },

  getProfile: async () => {
    return apiRequest("/auth/me", {
      method: "GET",
    });
  },

  logout: async () => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.warn("[API_CLIENT] Logout warning (cleaning up memory store anyway):", error);
    }
    setTokens(null, null);
  },
};
