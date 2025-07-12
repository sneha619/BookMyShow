import { axiosInstance } from "./index";

export const RegisterUser = async (value) => {
  try {
    const response = await axiosInstance.post("/api/user/register", value);
    return response.data;
  } catch (error) {
    console.error("Error details:", error.response?.data || error.message);
  }
};

export const LoginUser = async (value) => {
  try {

    const response = await axiosInstance.post("/api/user/login", value);
    return response.data;

  } catch (error) {
    console.error("Error details:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || "Login failed" };
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("getCurrentUser - No token found in localStorage");
      return { success: false, message: "No token found" };
    }

    console.log("getCurrentUser - Making API request with token");
    // Note: We don't need to manually set the Authorization header here
    // as the axios interceptor in index.js will add it automatically
    const response = await axiosInstance.get("/api/user/get-current-user");

    console.log("getCurrentUser - API Response:", response.data);

    if (!response.data) {
      console.warn("getCurrentUser - No data received from API");
      return { success: false, message: "No data received from server" };
    }
    
    if (!response.data.success) {
      console.warn("getCurrentUser - API reported failure:", response.data.message);
      return { success: false, message: response.data.message || "Server reported an error" };
    }
    
    if (!response.data.user) {
      console.warn("getCurrentUser - User data missing in the response");
      return { success: false, message: "User data missing in response" };
    }

    console.log("getCurrentUser - Successfully retrieved user data:", response.data.user);
    return { success: true, data: response.data.user };
  } catch (error) {
    console.error("getCurrentUser - Error fetching user:", error);
    console.error("Error details:", error.response?.data || error.message);
    return { 
      success: false, 
      message: error.response?.data?.message || "Error fetching current user",
      error: error.message
    };
  }
};

