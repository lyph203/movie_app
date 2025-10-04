import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import MovieDetailPage from "./features/movie/components/MovieDetailPage";
import ScrollToTop from "./components/common/ScrollToTop";
import ReleasePage from "./pages/Release";

function App() {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="movie/:id" element={<MovieDetailPage />} />
            <Route path="timeline" element={<ReleasePage />} />
          </Route>
        </Routes>
    </div>
  );
}

export default App;
