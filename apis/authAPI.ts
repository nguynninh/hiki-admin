import axiosClient from "./axiosClient";

const authAPI = async (
  url: string,
  data?: any,
  method?: "post" | "put" | "get" | "delete"
) => {
  return await axiosClient(`/auth${url}`, {
    method: method ?? "get",
    data,
  });
};
export default authAPI;
