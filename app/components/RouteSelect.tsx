import { useMemo } from "react";
import { FiHome, FiPaperclip } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router";

const RouteSelect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routes = useMemo(() => [
    { title: "Dashboard", icon: FiHome, path: "/" },
    { title: "Invoices", icon: FiPaperclip, path: "/invoices" },
  ], []);

  return (
    <div className="space-y-1">
      {routes.map(({ title, icon: Icon, path }) => {
        const selected = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex items-center gap-2 w-full rounded px-2 py-1.5 text-sm transition ${
              selected
                ? "bg-white text-stone-950 shadow"
                : "hover:bg-stone-200 text-stone-500"
            }`}
            aria-current={selected ? "page" : undefined}
          >
            <Icon className={selected ? "text-violet-500" : ""} />
            <span>{title}</span>
          </button>
        );
      })}
    </div>
  );
};

export default RouteSelect;
