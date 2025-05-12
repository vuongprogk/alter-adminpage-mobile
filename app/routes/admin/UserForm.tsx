import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { createUserRequest } from "~/api/user";

const UserForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userName: "",
    password: "",
    role: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: createUserRequest,
    onSuccess: () => {
      navigate("/users");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "role" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.userName || !form.password) {
      setError("Username, password, and role are required.");
      return;
    }

    mutation.mutate(form);
  };

  return (
    <div className="p-8 bg-gradient-to-r from-gray-50 via-purple-50 to-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-4xl font-extrabold text-purple-700 mb-8 text-center">
          Add New User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              name="userName"
              value={form.userName}
              onChange={handleChange}
              placeholder="Enter the username"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter a password"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Role
            </label>
            <select
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value={0}>User</option>
              <option value={1}>Admin</option>
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-100 p-2 rounded">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all"
          >
            Add User
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
