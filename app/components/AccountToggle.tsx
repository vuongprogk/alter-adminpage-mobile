import { useState, useRef, useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router";
import { logoutRequest } from "~/api/auth";
import React from "react";

const DropdownMenu = React.memo(({ onLogout }: { onLogout: () => void }) => (
  <div className="absolute mt-2 right-0 bg-white border border-gray-300 rounded shadow-md w-40 z-10 dark:bg-gray-800 dark:border-gray-700">
    <button
      onClick={onLogout}
      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm rounded-lg dark:hover:bg-gray-700 dark:text-gray-300"
    >
      Logout
    </button>
  </div>
));

const AccountToggle = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [cookies] = useCookies(["userInfo"]);
  const [userInfo, setUserInfo] = useState("");

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout handler
  const handleLogout = useCallback(async () => {
    try {
      const res = await logoutRequest();
      if (res?.isSuccessStatusCode) {
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [navigate]);

  // Auth check
  useEffect(() => {
    const user = cookies?.userInfo;
    if (!user?.Username || user?.Role !== 1) {
      navigate("/login");
    } else {
      setUserInfo(user.Username);
    }
  }, [cookies, navigate]);

  return (
    <div
      className="relative border-b mb-4 mt-2 pb-4 border-gray-300"
      ref={dropdownRef}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex p-1 hover:bg-gray-200 rounded-lg transition-colors relative gap-2 w-full items-center dark:hover:bg-gray-700"
      >
        <img
          src="https://api.dicebear.com/9.x/notionists/svg"
          alt="avatar"
          className="w-8 h-8 rounded-full bg-violet-500 shadow"
        />
        <div className="text-start">
          <span className="text-sm font-bold block text-gray-800 dark:text-gray-200">
            {userInfo}
          </span>
        </div>
      </button>

      <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
      {open && <DropdownMenu onLogout={handleLogout} />}
    </div>
  );
};

export default AccountToggle;
