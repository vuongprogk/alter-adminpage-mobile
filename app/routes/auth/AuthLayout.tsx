import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm bg-white rounded shadow p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
