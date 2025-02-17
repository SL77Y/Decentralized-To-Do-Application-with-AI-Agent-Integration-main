import api from "./api.service";

interface LoginData {
  email: string;
  password: string;
  wallet_address: string;
}

interface RegisterData extends LoginData {
  first_name: string;
  last_name: string;
  confirm_password: string;
}

export const authService = {
  login: async (data: LoginData) => {
    try {
      const response = await api.post("/auth/login", data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    try {
      const response = await api.post("/auth/register", data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};
