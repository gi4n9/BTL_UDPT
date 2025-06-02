interface RegisterResponse {
  message: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    status: "VERIFY" | "ACTIVE" | "BLOCKED";
  };
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    status: "VERIFY" | "ACTIVE" | "BLOCKED";
  };
}

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: "VERIFY" | "ACTIVE" | "BLOCKED";
  profile_image?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<RegisterResponse> => {
  console.log("Register called with:", {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  });
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }
  const response = await fetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      confirmPassword,
    }),
  });
  const data = await response.json();
  console.log("Response from server:", data);
  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }
  return data;
};

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }
  return data;
};

export const getUserProfile = async (): Promise<UserProfile> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const response = await fetch("/auth/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user profile");
  }
  return data;
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem("token");
  await fetch("/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
};
