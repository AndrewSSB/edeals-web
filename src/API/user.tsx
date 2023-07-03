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

interface updateUserProps {
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  email: string | null | undefined;
  phoneNumber: string | null | undefined;
  username: string | null | undefined;
}

export const updateUser = async (props: updateUserProps) => {
  const response = await axios.put(
    `${ApiUrls.updateUser}`,
    {
      firstName: props.firstName,
      lastName: props.lastName,
      email: props.email,
      phoneNumber: props.phoneNumber,
      username: props.username,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  return response;
};

export const closeAccount = async () => {
  const response = await axios.delete(`${ApiUrls.deleteAccount}`, {
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

export const getUsers = async (username: string | null) => {
  let url = ApiUrls.getUsers;

  if (username !== null) {
    url += `?userName=${username}`;
  }

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response;
};

export const getUsersAdmin = async () => {
  const response = await axios.get(ApiUrls.getUsersAdmin, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response;
};

export const sendEmailVerificationCode = async () => {
  const response = await axios.post(
    `${ApiUrls.sendEmailCode}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  return response;
};

export const confirmEmail = async (token: string) => {
  const response = await axios.post(
    `${ApiUrls.validateEmail}`,
    { token: token },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  return response;
};

export const sendPhoneVerificationCode = async () => {
  const response = await axios.post(
    `${ApiUrls.sendPhoneCode}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  return response;
};

export const confirmPhoneNumber = async (digitCode: string) => {
  const response = await axios.post(
    `${ApiUrls.validatePhone}/${digitCode}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  return response;
};

export const blockUser = async (id: string) => {
  const response = await axios.post(
    `${ApiUrls.blockUser}/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  return response;
};

export const unblockUser = async (id: string) => {
  const response = await axios.post(
    `${ApiUrls.unblockUser}/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  return response;
};
