import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { loginRequest } from "~/api/auth";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cookies] = useCookies(["userInfo"]);

  // Redirect if user is already logged in
  useEffect(() => {
    const isLoggedIn =
      cookies?.userInfo &&
      typeof cookies.userInfo === "object" &&
      cookies.userInfo.Role === 1;

    if (isLoggedIn) navigate("/");
  }, [cookies, navigate]);

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

    try {
      const res = await loginRequest(username, password);
      if (res?.isSuccessStatusCode && res.statusCode === 200) {
        navigate("/");
      } else {
        setError(res?.message || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">Login</h1>
      <p className="text-sm text-gray-600 mb-6">
        Enter your Username and password to access your account.
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

        {error && (
          <p className="text-sm text-red-600 bg-red-100 p-2 rounded">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-violet-600 text-white font-medium py-2 rounded hover:bg-violet-700 transition"
        >
          Login
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        Don't have an account?{" "}
        <a href="/register" className="text-violet-600 underline">
          Sign up
        </a>
      </p>
    </>
  );
}
