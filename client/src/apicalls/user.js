import { axiosInstance } from "./index";

export const RegisterUser = async (value) => {
  try {
    const response = await axiosInstance.post("api/user/register", value);
    return response.data;
  } catch (error) {
    console.error("Error details:", error.response?.data || error.message);
  }
};

export const LoginUser = async (value) => {
  try {

    const response = await axiosInstance.post("api/user/login", value);
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
      return { success: false, message: "No token found" };
    }

    const response = await axiosInstance.get("api/user/get-current-user", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return { success: true, data: response.data.user };
  } catch (error) {
    console.error("Error fetching user:", error.response?.data || error.message); // Add this line to log the error details
    return { success: false, message: error.response?.data?.message || "Error fetching user" };
  }
};

