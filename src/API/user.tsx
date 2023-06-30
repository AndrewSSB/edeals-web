import axios from "axios";
import { ApiUrls } from "./Routes";
import { Address } from "../context/UserContext";

export const getUser = async () => {
  const response = await axios.get(`${ApiUrls.userInfo}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response;
};

export const saveUserAddress = async (props: Address) => {
  const response = await axios.post(
    `${ApiUrls.saveAddress}`,
    {
      country: props.country,
      city: props.city,
      region: props.region,
      postalCode: props.postalCode,
      address: props.address,
      addressAditionally: props.addressAditionally,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  return response;
};

export const getAddress = async () => {
  const response = await axios.get(`${ApiUrls.getAddress}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response;
};

export const getConversations = async () => {
  const response = await axios.get(ApiUrls.getConversations, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response;
};

export const getMyReviews = async () => {
  const response = await axios.get(ApiUrls.getReviews, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response;
};
