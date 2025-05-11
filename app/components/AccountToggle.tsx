import { useState, useRef, useEffect } from "react";
import { useCookies } from "react-cookie";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router";
import { logoutRequest } from "~/api/auth";
import React from "react";

const DropdownMenu = React.memo(({ onLogout }: { onLogout: () => void }) => (
  <div className="absolute mt-2 right-0 bg-white border border-stone-300 rounded shadow-md w-40 z-10">
    <button
      onClick={onLogout}
      className="w-full text-left px-4 py-2 hover:bg-stone-100 text-sm rounded-2xl"
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
  const handleLogout = async () => {
    const res = await logoutRequest();
    if (res?.isSuccessStatusCode) {
      navigate("/login");
    } else {
      console.error("Logout failed");
    }
  };

  // Auth check
  useEffect(() => {
    if (!cookies?.userInfo?.Username || cookies?.userInfo?.Role !== 1) {
      navigate("/login");
    } else {
      setUserInfo(cookies.userInfo.Username);
    }
  }, [cookies]);

  return (
    <div
      className="relative border-b mb-4 mt-2 pb-4 border-stone-300"
      ref={dropdownRef}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex p-0.5 hover:bg-stone-200 rounded transition-colors relative gap-2 w-full items-center"
      >
        <img
          src="https://api.dicebear.com/9.x/notionists/svg"
          alt="avatar"
          className="size-8 rounded shrink-0 bg-violet-500 shadow"
        />
        <div className="text-start">
          <span className="text-sm font-bold block">{userInfo}</span>
        </div>
      </button>

      <FiChevronDown className="absolute right-2 top-1/2 translate-y-[calc(-50%-4px)] text-xs" />
      {open && <DropdownMenu onLogout={handleLogout} />}
    </div>
  );
};

export default AccountToggle;
