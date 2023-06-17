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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
