import { localDataNames } from "@/constants/appInfos";
import axiosClient from "./axiosClient";

const handleAPI = async (
  url: string,
  data?: any,
  method?: "post" | "put" | "get" | "delete"
) => {
  const getAssetToken = () => {
    const res = localStorage.getItem(localDataNames.authData);

    if (res) {
      const auth = JSON.parse(res);
      return auth && auth.token ? auth.token : "";
    } else {
      return "";
    }
  };

  return await axiosClient(url, {
    method: method ?? "get",
    data,
    headers: {
      Authorization: `Bearer ${getAssetToken()}`,
    },
  });
};
export default handleAPI;
