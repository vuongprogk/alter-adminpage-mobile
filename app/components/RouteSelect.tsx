import { useMemo } from "react";
import {
  FiHome,
  FiMap,
  FiPaperclip,
  FiUsers,
  FiSettings,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router";

const RouteSelect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routes = useMemo(
    () => [
      { title: "Dashboard", icon: FiHome, path: "/" },
      { title: "Tour", icon: FiMap, path: "/tours" },
      { title: "User", icon: FiUsers, path: "/users" },
      { title: "Book", icon: FiPaperclip, path: "/bookings" },
      { title: "Services", icon: FiSettings, path: "/services" },
    ],
    []
  );

  return (
    <div className="space-y-1">
      {routes.map(({ title, icon: Icon, path }) => {
        const selected = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex items-center gap-3 w-full rounded px-3 py-2 text-sm transition ${
              selected
                ? "bg-violet-100 text-violet-900 shadow dark:bg-violet-800 dark:text-white"
                : "hover:bg-stone-200 text-stone-500 dark:hover:bg-stone-700 dark:text-stone-300"
            }`}
            aria-current={selected ? "page" : undefined}
          >
            <Icon
              className={`text-lg ${
                selected ? "text-violet-500" : "dark:text-stone-400"
              }`}
            />
            <span>{title}</span>
          </button>
        );
      })}
    </div>
  );
};

export default RouteSelect;
