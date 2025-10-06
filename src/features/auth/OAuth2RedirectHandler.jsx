import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function OAuth2Callback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const handledRef = useRef(false); // Prevent double execution

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("token");
    const refreshToken = params.get("refreshToken");
    const username = params.get("username");

    console.log("Query params (initial):", { accessToken, refreshToken, username });

    if (accessToken && refreshToken && username) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("username", username);

      setUser(username); // Pass only the username string

      window.history.replaceState({}, document.title, "/");
      navigate("/");
    } else {
      console.warn("Missing tokens or username, redirecting to login");
      navigate("/login");
    }
  }, [navigate, setUser]);

  return <div>Processing login...</div>;
}