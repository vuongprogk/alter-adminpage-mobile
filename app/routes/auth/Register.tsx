import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { registerRequest } from "~/api/auth";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cookies] = useCookies(["userInfo"]);

  // Redirect if already logged in
  useEffect(() => {
    const isLoggedIn =
      cookies?.userInfo &&
      typeof cookies.userInfo === "object" &&
      cookies.userInfo.Role === 1;

    if (isLoggedIn) navigate("/");
  }, [cookies, navigate]);

  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setError("Passwords do not match");
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await registerRequest(username, password);
      if (res.isSuccessStatusCode && res.statusCode === 200) {
        navigate("/login");
      } else {
        setError(res.message || "Registration failed");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">Register</h1>
      <p className="text-sm text-gray-600 mb-6">
        Enter your Username and password to register a new account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="w-full mt-1 px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-violet-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full mt-1 px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-violet-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            className="w-full mt-1 px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-violet-500"
            value={confirmPassword}
            onChange={handleConfirmPassword}
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-100 p-2 rounded">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-violet-600 text-white font-medium py-2 rounded hover:bg-violet-700 transition"
        >
          Register
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-violet-600 underline">
          Login
        </a>
      </p>
    </>
  );
}
