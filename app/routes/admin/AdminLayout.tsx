import { Outlet } from "react-router";
import Sidebar from "~/components/Sidebar";

const AdminLayout = () => {
  return (
    <main className="grid grid-cols-[280px_1fr] min-h-screen bg-gray-50">
      <aside className="bg-white shadow-lg border-r border-gray-200">
        <Sidebar />
      </aside>
      <section className="p-8 bg-gradient-to-r from-gray-50 via-purple-50 to-gray-50">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </section>
    </main>
  );
};

export default AdminLayout;
