import { Outlet } from "react-router"
import Sidebar from "~/components/Sidebar"

const AdminLayout = () => {

  return (
    <main className="grid p-4 gap-4 grid-cols-[279px_1fr]">
      <Sidebar />
      <Outlet />
    </main>
  )
}

export default AdminLayout
