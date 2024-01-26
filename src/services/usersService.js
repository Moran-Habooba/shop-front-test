import httpService from "./httpService";
import config from "../config.json";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

refreshTokenHeader();

export function refreshTokenHeader() {
  httpService.setCommonHeader("x-auth-token", getJWT());
}

export function createUser(user) {
  return httpService.post(config.apiUrlUsersRegister, user);
}

export function getUserById(id) {
  refreshTokenHeader();
  return httpService.get(`${config.apiUrlUserById}${id}`);
}

export function getAllUsers() {
  return httpService.get(config.apiUrlAllUser);
}

export function updateUsers(id, user) {
  return httpService.put(`${config.apiUrlUpdateUser}${id}`, user);
}

export function deleteUser(id) {
  return httpService.delete(`${config.apiUrlDeleteUser}${id}`);
}

// export function ReplaceUserStatus(id, newStatus) {
//   return httpService.patch(`${config.apiUrlUserBusiness}${id}`, newStatus);
// }
export function ReplaceUserStatus(id, newStatus) {
  const data = {
    isBusiness: newStatus === "Business",
    isAdmin: newStatus === "Admin",
  };
  return httpService.patch(`${config.apiUrlUserBusiness}${id}`, data);
}

export async function login(credentials) {
  const response = await httpService.post(config.apiUrlUsersLogin, credentials);
  localStorage.setItem(TOKEN_KEY, response.data.token);
  refreshTokenHeader();

  return response;
}
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  refreshTokenHeader();
}
export function getJWT() {
  return localStorage.getItem(TOKEN_KEY);
}
console.log("token" + localStorage.getItem(TOKEN_KEY));

export function getUser() {
  try {
    const token = getJWT();
    return jwtDecode(token);
  } catch {
    return null;
  }
}

const usersService = {
  createUser,
  login,
  logout,
  getJWT,
  getUser,
  getUserById,
  getAllUsers,
  updateUsers,
  deleteUser,
  ReplaceUserStatus,
};

export default usersService;
