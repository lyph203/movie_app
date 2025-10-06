import { createContext, useContext, useState, useEffect } from "react";
import {
  login as apiLogin,
  register as apiSignUp,
  logout as apiLogout,
  getCurrentUser,
  refreshToken as apiRefresh,
} from "@/api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => localStorage.getItem("username") || null);
  const [loading, setLoading] = useState(true);

  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);

  // Khi có accessToken nhưng chưa có user thì gọi API lấy user detail
  useEffect(() => {
    if (accessToken && !user) {
      getCurrentUser()
        .then((u) => setUser(u))
        .catch(() => {
          if (refreshToken) {
            handleRefreshToken();
          } else {
            handleLogout();
          }
        });
    }
  }, [accessToken]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const username = localStorage.getItem("username");

    if (token && username) {
      setUser(username); // ✅ chỉ giữ string
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Hàm login
  const login = async (credentials) => {
    const data = await apiLogin(credentials); // { accessToken, refreshToken, username }
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser(data.username);

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("username", data.username);
  };

  const register = async (credentials) => {
    const data = await apiSignUp(credentials);
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser(data.username);

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("username", data.username); 
  }

  // Hàm refresh token
  const handleRefreshToken = async () => {
    try {
      const data = await apiRefresh(refreshToken); // { accessToken, username? }
      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);

      if (data.username) {
        setUser(data.username);
        localStorage.setItem("username", data.username); // ✅ đồng bộ
      }
    } catch (err) {
      handleLogout();
    }
  };

  // Hàm logout
  const handleLogout = () => {
    apiLogout();
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider
      value={{
        user,          // string (username) hoặc null
        accessToken,
        refreshToken,
        setUser,
        register,
        login,
        logout: handleLogout,
        refresh: handleRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
