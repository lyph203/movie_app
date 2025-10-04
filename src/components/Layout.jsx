import Header from "./common/Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
