import {
  request
} from "@/plugins/request";

export const login = (data) => {
  return request({
    method: "POST",
    url: "/api/users/login",
    data,
  });
};
export const register = (data) => {
  return request({
    method: "POST",
    url: "/api/users",
    data,
  });
};
export const getProfile = (username) => {
  return request({
    method: "GET",
    url: `/api/profiles/${username}`,
  });
};