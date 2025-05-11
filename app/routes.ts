import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/admin/AdminLayout.tsx", [
    index("routes/admin/Daskboard.tsx"),
    route("/users", "routes/admin/Users.tsx"),
    route("/user/:userId", "routes/admin/User.tsx"),
  ]),
  layout("routes/auth/AuthLayout.tsx", [
    route("/login", "routes/auth/Login.tsx"),
    route("/register", "routes/auth/Register.tsx"),
  ]),
] satisfies RouteConfig;
