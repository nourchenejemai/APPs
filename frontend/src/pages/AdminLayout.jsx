import { Outlet } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";
import Sidebar from "../components/Sidebar";


function AdminLayout() {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <NavbarAdmin />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
        <main className="flex-1 bg-gray-50 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
