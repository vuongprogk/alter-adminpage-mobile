import { useNavigate } from "react-router";
import AccountToggle from "./AccountToggle";
import RouteSelect from "./RouteSelect";
const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="overflow-y-hidden sticky top-0 h-[calc(100vh-64px)]">
      <div
        className="flex justify-between items-center px-4 py-2 border-b border-stone-300 dark:border-stone-700 curosr-pointer"
        onClick={() => navigate("/")}
      >
        <span className="text-lg font-bold text-stone-700 dark:text-stone-300">
          Admin Panel
        </span>
      </div>
      <AccountToggle />
      <RouteSelect />
    </div>
  );
};

export default Sidebar;
