import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({}); // State for validation errors
  const [apiError, setApiError] = useState(""); // State for API errors
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // After Google login, backend redirects to FE with tokens
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("token");
    const refreshToken = params.get("refreshToken");
    const username = params.get("username");

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      if (username) localStorage.setItem("username", username); // Fixed: Removed JSON.stringify

      // Clear query string from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleGoogleLogin = () => {
    // Redirect to backend for Google OAuth2
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(""); // Clear previous API errors

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    try {
      await login(form);
      setIsLoggedIn(true);
    } catch (err) {
      console.log(err);
      setApiError(err.error || "Login failed. Please check your credentials.");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-black text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-4 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-28 flex flex-col items-center">
            <div className="flex items-center justify-center space-x-3">
              <img src="./logo.png" alt="logo" />
              <h1 className="text-2xl xl:text-3xl text-indigo-800 font-extrabold">
                Sign In
              </h1>
            </div>
            <div className="flex flex-col items-center w-96 mt-10">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full max-w-xs font-bold shadow-sm rounded-lg cursor-pointer py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
              >
                <div className="bg-white p-2 rounded-full">
                  <svg className="w-4" viewBox="0 0 533.5 544.3">
                    <path
                      d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                      fill="#4285f4"
                    />
                    <path
                      d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                      fill="#34a853"
                    />
                    <path
                      d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                      fill="#fbbc04"
                    />
                    <path
                      d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                      fill="#ea4335"
                    />
                  </svg>
                </div>
                <span className="ml-4">Sign In with Google</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mx-auto w-9/12">
              <div className="w-full flex-1 mt-8">
                <div className="my-6 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Or Sign In with e-mail
                  </div>
                </div>
                <div className="mx-auto max-w-xs">
                  <div>
                    <input
                      className={`w-full px-8 py-4 rounded-lg font-medium border ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="mt-5">
                    <input
                      className={`w-full px-8 py-4 rounded-lg font-medium border ${
                        errors.password ? "border-red-500" : "border-gray-200"
                      } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                      type="password"
                      placeholder="Password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="mt-5 cursor-pointer tracking-wide font-semibold bg-indigo-900 text-white w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <span>Sign In</span>
                  </button>
                </div>
                {apiError && (
                  <div className="text-red-500 text-sm text-center mb-4">
                    {apiError}
                  </div>
                )}
                <div className="my-4 text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Don't have an account?{" "}
                    <span
                      onClick={handleSignUp}
                      className="text-indigo-900 cursor-pointer"
                    >
                      Sign Up
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div className="m-12 w-full bg-contain bg-center bg-no-repeat bg-[url('/hero.png')]"></div>
        </div>
      </div>
    </div>
  );
}
