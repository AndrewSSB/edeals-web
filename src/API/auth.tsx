import axios from "axios";
import instance from "./instance";
import { ApiUrls } from "./Routes";

export const registerUser = async (
  firstName: string,
  lastName: string,
  userName: string,
  email: string,
  phoneNumber: string,
  password: string
) => {
  const response = await instance.post(`${ApiUrls.register}`, {
    firstName: firstName,
    lastName: lastName,
    userName: userName,
    email: email,
    phoneNumber: phoneNumber,
    password: password,
  });

  return response;
};

export const loginUser = async (
  userName: string | null,
  email: string | null,
  password: string
) => {
  const response = await instance.post(`${ApiUrls.login}`, {
    userName: userName,
    email: email,
    password: password,
  });

  return response;
};

export const logoutUser = async () => {
  console.log(localStorage.getItem("accessToken"));
  const response = await axios.post(
    `${ApiUrls.logout}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  return response;
};
