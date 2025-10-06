import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import MovieDetailPage from "./features/movie/components/MovieDetailPage";
import ScrollToTop from "./components/common/ScrollToTop";
import ReleasePage from "./pages/Release";
import AuthPage from "./pages/Auth";
import ProtectedRoute from "./features/auth/ProtectedRoutes";
import ProfilePage from "./pages/Profile";
import OAuth2Callback from "./features/auth/OAuth2RedirectHandler";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WishlistPage from "./pages/WishlistPage";

function App() {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<AuthPage isLogin={true} />} />
        <Route path="/register" element={<AuthPage isLogin={false} />} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="movie/:id" element={<MovieDetailPage />} />
          <Route path="timeline" element={<ReleasePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default App;
