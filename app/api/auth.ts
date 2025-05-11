import { sendRequest } from "./client";

const loginRequest = async (username: string, password: string) => {
  const res = await sendRequest("/auth/login", "POST", {
    username,
    password,
  });
  return res;
}
const registerRequest = async (username: string, password: string) => {
  const res = await sendRequest("/auth/register", "POST", {
    username,
    password,
  });
  return res;
}
const logoutRequest = async () => {
  const res = await sendRequest("/auth/logout", "POST");
  return res;
}
export { loginRequest, registerRequest, logoutRequest };
