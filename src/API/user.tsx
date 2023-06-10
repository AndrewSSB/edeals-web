import axios from "axios";
import { ApiUrls } from "./Routes";

export const getUser = async () => {
  const response = await axios.get(`${ApiUrls.userInfo}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });

  return response;
};
