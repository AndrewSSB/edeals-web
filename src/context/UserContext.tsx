import React, { createContext, useEffect, useState } from "react";
import { getAddress, getUser } from "../API/user";
import {
  connectToHub,
  sendJoinNotificationChannel,
} from "../components/Chat/SignalR";
import * as signalR from "@microsoft/signalr";

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
  isEmailVerified: boolean;
  phoneNumber: string;
  isPhoneNumberVerified: boolean;
  profileImage: string;
  addresses: Address[];
}

export interface Conversation {
  receiverUsername: string;
}

export interface Order {
  orderId: number;
}

export interface Notification {
  sender: string;
  receiver: string;
  type: string;
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
  conversations: Conversation[];
  setConversations: (value: Conversation[]) => void;
  connection: signalR.HubConnection | null;
  setConnection: (value: signalR.HubConnection) => void;
  order: Order;
  setOrder: (value: Order) => void;
  notification: Notification[];
  setNotification: (value: Notification[]) => void;
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
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [order, setOrder] = useState<Order>({ orderId: 0 });
  const [notification, setNotification] = useState<Notification[]>([]);

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

  useEffect(() => {
    const getConnection = async () => {
      try {
        const response = await connectToHub();
        setConnection(response);
      } catch (err: any) {}
    };

    getConnection();
  }, []);

  useEffect(() => {
    const joinNotificationChannel = async () => {
      try {
        await sendJoinNotificationChannel(connection);
      } catch (e) {
        console.error(e);
      }
    };

    setTimeout(joinNotificationChannel, 2000);
  }, [connection]);

  useEffect(() => {
    const receiveNotifications = () => {
      if (
        connection &&
        connection.state === signalR.HubConnectionState.Connected &&
        isAuthenticated
      ) {
        console.log("mergi ma ?");
        connection.on("ReceiveNotification", (sender, receiver, type) => {
          console.log(sender, receiver, type);
          setNotification((prev) => {
            const isDuplicate = prev.some(
              (item) =>
                item.sender === sender &&
                item.receiver === receiver &&
                item.type === type
            );

            if (isDuplicate) {
              return prev;
            } else {
              return [
                ...prev,
                { sender: sender, receiver: receiver, type: type },
              ];
            }
          });
        });

        return () => {
          connection!.off("ReceiveNotification");
        };
      } else {
        console.error("No connection to chatHub yet!");
      }
    };

    setTimeout(receiveNotifications, 2000);
  }, [connection]);

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
        conversations,
        setConversations,
        connection,
        setConnection,
        order,
        setOrder,
        notification,
        setNotification,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
