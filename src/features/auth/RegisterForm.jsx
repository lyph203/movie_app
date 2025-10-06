import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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
      if (username) localStorage.setItem("username", username);

      // Clear query string from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleGoogleLogin = () => {
    // Redirect to backend for Google OAuth2
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleLogin = () => {
    navigate("/login");
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

    // Username validation
    if (!form.username) {
      newErrors.username = "Username is required";
    } else if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    // Full Name validation
    if (!form.fullName) {
      newErrors.fullName = "Full Name is required";
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(form.password)) {
      newErrors.password =
        "Password must be at least 8 characters, including one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm Password validation
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle input changes and clear corresponding error
  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(""); // Clear previous API errors

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    try {
      await register(form);
      setIsLoggedIn(true);
    } catch (err) {
      setApiError(err.message || "Registration failed. Please try again.");
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
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center space-x-3">
              <img src="./logo.png" alt="logo" />
              <h1 className="text-2xl xl:text-3xl text-indigo-800 font-extrabold">
                Sign Up
              </h1>
            </div>
            <div className="flex flex-col items-center w-96 mt-6">
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
                <span className="ml-4">Sign Up with Google</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mx-auto w-9/12">
              <div className="w-full flex-1 mt-2">
                <div className="my-6 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Or Sign Up with e-mail
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
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <input
                      className={`w-full px-8 py-4 rounded-lg font-medium border ${
                        errors.username ? "border-red-500" : "border-gray-200"
                      } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                      type="text"
                      placeholder="Username"
                      value={form.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.username}
                      </p>
                    )}
                  </div>
                  <div className="mt-4">
                    <input
                      className={`w-full px-8 py-4 rounded-lg font-medium border ${
                        errors.fullName ? "border-red-500" : "border-gray-200"
                      } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                      type="text"
                      placeholder="Full Name"
                      value={form.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                  <div className="mt-4">
                    <input
                      className={`w-full px-8 py-4 rounded-lg font-medium border ${
                        errors.password ? "border-red-500" : "border-gray-200"
                      } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                      type="password"
                      placeholder="Password"
                      value={form.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div className="mt-4">
                    <input
                      className={`w-full px-8 py-4 rounded-lg font-medium border ${
                        errors.confirmPassword ? "border-red-500" : "border-gray-200"
                      } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                      type="password"
                      placeholder="Confirm Password"
                      value={form.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                {apiError && (
                  <div className="text-red-500 text-sm text-center mt-4">
                    {apiError}
                  </div>
                )}  
                  <button
                    type="submit"
                    className="mt-4 cursor-pointer tracking-wide font-semibold bg-indigo-900 text-white w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <span>Sign Up</span>
                  </button>
                </div>
                <div className="my-4 text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Already have an account?{" "}
                    <span
                      onClick={handleLogin}
                      className="text-indigo-900 cursor-pointer"
                    >
                      Sign In
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