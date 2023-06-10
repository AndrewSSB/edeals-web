import React, { createContext, useEffect, useState } from "react";
import { getUser } from "../API/user";

type UserContextProps = {
  children: React.ReactNode;
};

export interface User {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  isEmailVerified: Boolean;
  phoneNumber: string;
  isPhoneNumberVerified: Boolean;
}

type UserContextType = {
  firstName: string | null;
  setFirstName: (value: string) => void;
  lastName: string | null;
  setLastName: (value: string) => void;
  email: string | null;
  setEmail: (value: string) => void;
  userName: string | null;
  setUserName: (value: string) => void;
  phoneNumber: string | null;
  setPhoneNumber: (value: string) => void;
  token: string | null;
  setToken: (value: string) => void;
  userData: User;
  setUserData: (value: User) => void;
};

export const UserContext = createContext<UserContextType>(
  {} as UserContextType
);

export const UserContextProvider = ({ children }: UserContextProps) => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<User>({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    isEmailVerified: false,
    phoneNumber: "",
    isPhoneNumberVerified: false,
  });

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      const fetchUserDetails = async () => {
        try {
          const response = await getUser();

          const userDetails = response.data.responseData;

          setUserData({
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            userName: userDetails.userName,
            email: userDetails.email,
            isEmailVerified: userDetails.isEmailVerified,
            phoneNumber: userDetails.phoneNumber,
            isPhoneNumberVerified: userDetails.isPhoneNumberVerified,
          });
        } catch (error) {
          console.error("Failed to fetch user details:", error);
        }
      };

      fetchUserDetails();
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        firstName,
        setFirstName,
        lastName,
        setLastName,
        email,
        setEmail,
        userName,
        setUserName,
        phoneNumber,
        setPhoneNumber,
        token,
        setToken,
        userData,
        setUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
