
// export const BASE_URL = "https://api-wineshippingerp.prudent360.in/api/v1/"; 
export const BASE_URL = "http://192.168.1.7:3000/api/v1/"; 


export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  GET_USER: "/users/me",
  UPDATE_USER: "/users/update",
};

export type ApiEndpoints = keyof typeof API_ENDPOINTS;

export const getApiUrl = (endpoint: ApiEndpoints): string => {
  return `${BASE_URL}${API_ENDPOINTS[endpoint]}`;
};
