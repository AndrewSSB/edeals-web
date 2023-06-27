import React, { createContext, useEffect, useState } from "react";
import { getUser } from "../API/user";

type UserContextProps = {
  children: React.ReactNode;
};

export interface Address {
  country?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  address?: string;
  addressAditionally?: string;
  mentiuni?: string;
}

export interface User {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  isEmailVerified: Boolean;
  phoneNumber: string;
  isPhoneNumberVerified: Boolean;
  profileImage: string;
  addresses: Address[];
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
  profileImage: string;
  setProfileImage: (value: string) => void;
  favoriteAddress: Address;
  setFavoriteAddress: (value: Address) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
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
    profileImage: "",
    addresses: [],
  });
  const [profileImage, setProfileImage] = useState<string>("");
  const [favoriteAddress, setFavoriteAddress] = useState<Address>({
    country: "",
    city: "",
    region: "",
    postalCode: "",
    address: "",
    addressAditionally: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // // User Details
  // useEffect(() => {
  //   const isAuthenticated = localStorage.getItem("accessToken") ? true : false;
  //   setIsAuthenticated(isAuthenticated);
  //   const fetchUserDetails = async () => {
  //     if (isAuthenticated) {
  //       try {
  //         const response = await getUser();

  //         const userDetails = response.data.responseData;

  //         setUserData({
  //           firstName: userDetails.firstName,
  //           lastName: userDetails.lastName,
  //           userName: userDetails.userName,
  //           email: userDetails.email,
  //           isEmailVerified: userDetails.isEmailVerified,
  //           phoneNumber: userDetails.phoneNumber,
  //           isPhoneNumberVerified: userDetails.isPhoneNumberVerified,
  //           profileImage: "",
  //           addresses: userDetails.addresses,
  //         });

  //         setFirstName(userDetails.firstName);
  //         setLastName(userDetails.lastName);
  //       } catch (error: any) {
  //         localStorage.removeItem("accessToken");
  //         localStorage.removeItem("refreshToken");
  //         console.error("Failed to fetch user details:", error);
  //       }
  //     }
  //   };
  //   fetchUserDetails();
  // }, []);

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
        profileImage,
        setProfileImage,
        favoriteAddress,
        setFavoriteAddress,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
