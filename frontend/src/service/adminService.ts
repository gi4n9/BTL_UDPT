import axios from 'axios';

const API_URL = 'http://localhost:3004/admin'; // Update with your actual API URL

export interface User {
  _id: string;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'user' | 'artist';
  status: 'VERIFY' | 'ACTIVE' | 'BLOCKED';
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const adminService = {
  // Get all users
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    try {
      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Update user status
  updateUserStatus: async (userId: string, status: User['status']): Promise<ApiResponse<User>> => {
    try {
      const response = await axios.put(
        `${API_URL}/user/${userId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  // Update user role
  updateUserRole: async (userId: string, role: User['role']): Promise<ApiResponse<User>> => {
    try {
      const response = await axios.put(
        `${API_URL}/user/${userId}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await axios.delete(`${API_URL}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
}; 