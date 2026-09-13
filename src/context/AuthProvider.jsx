export { AuthProvider, useAuth, DEFAULT_USER } from "./AuthContext";

// exportable function that can be called from anywhere
export const logoutFromAnywhere = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("karat360-access-token");
};