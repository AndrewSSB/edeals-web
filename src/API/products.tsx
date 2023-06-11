import axios from "axios";
import { ApiUrls } from "./Routes";

export const getProducts = async () => {
  const response = await axios.get(`${ApiUrls.getProducts}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response;
};
