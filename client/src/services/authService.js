import { axiosInstance } from '../apicalls';

export const AuthService = {
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post("/api/user/login", credentials);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get("/api/user/get-current-user");
      return { success: true, data: response.data.user };
    } catch (error) {
      console.error('Get user error:', error);
      return { success: false, message: error.response?.data?.message || 'Error fetching user' };
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
  }
};