import { apiClient } from "@/services/backend"; // axios instance

// 🔹 Login: BE trả về { accessToken, refreshToken, username }
export async function login(credentials) {
  const res = await apiClient.post("auth/login", credentials);
  const { accessToken, refreshToken, username } = res.data;

  // lưu token + username vào localStorage
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("username", username);

  return { accessToken, refreshToken, username };
}

// 🔹 Register
export async function register(data) {
  const res = await apiClient.post("auth/signup", data);
  const { accessToken, refreshToken, username } = res.data;

  // lưu token + username vào localStorage
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("username", username);

  return { accessToken, refreshToken, username };
}

// 🔹 Logout
export async function logout() {
  try {
    await apiClient.post("auth/logout"); // nếu BE có endpoint logout
  } catch (_) {
    // ignore nếu BE không có
  }
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("username");
}

// 🔹 Get current username từ BE (dùng accessToken), fallback từ localStorage
export async function getCurrentUser() {
  try {
    const res = await apiClient.get("/auth/me"); // BE cần có endpoint này
    return res.data;
  } catch (err) {
    // fallback: lấy từ localStorage
    const username = localStorage.getItem("username");
    return username ?? null;
  }
}

// 🔹 Refresh token để lấy access token mới
export async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token");

  const res = await apiClient.post("auth/refresh", { refreshToken });
  const { accessToken, username } = res.data;

  localStorage.setItem("accessToken", accessToken);
  if (username) {
    localStorage.setItem("username", username);
  }

  return { accessToken, username };
}
