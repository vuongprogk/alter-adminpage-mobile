import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/admin/AdminLayout.tsx", [
    index("routes/admin/Daskboard.tsx"),
    route("/tours", "routes/admin/Tours.tsx"),
    route("/tour/form/:tourId?", "routes/admin/TourForm.tsx"),
    route("/tour/:tourId?", "routes/admin/Tour.tsx"),
    route("/users", "routes/admin/Users.tsx"),
    route("/user/form", "routes/admin/UserForm.tsx"),
    route("/bookings", "routes/admin/Books.tsx"),
    route("/services", "routes/admin/Services.tsx"),
    route("/service/form/:serviceId?", "routes/admin/ServiceForm.tsx"),
  ]),
  layout("routes/auth/AuthLayout.tsx", [
    route("/login", "routes/auth/Login.tsx"),
    route("/register", "routes/auth/Register.tsx"),
  ]),
  route("*", "components/NotFound.tsx"),
] satisfies RouteConfig;
