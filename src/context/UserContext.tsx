import React, { createContext, useContext, useEffect, useState } from "react";
import { getAddress, getUser } from "../API/user";
import {
  connectToHub,
  sendJoinNotificationChannel,
} from "../components/Chat/SignalR";
import * as signalR from "@microsoft/signalr";
import { ChatContext } from "./ChatContext";

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
  channelId: string;
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
  channelId: string;
  setChannelId: (value: string) => void;
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
  const [channelId, setChannelId] = useState<string>("");

  const { isChatOpen } = useContext(ChatContext);

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
        console.log("Conectat la generic notifications");
      } catch (e) {
        console.error(e);
      }
    };

    setTimeout(joinNotificationChannel, 5000);
  }, [connection]);

  useEffect(() => {
    const receiveNotifications = () => {
      if (
        connection &&
        connection.state === signalR.HubConnectionState.Connected &&
        isAuthenticated &&
        !isChatOpen
      ) {
        console.log("mergi ma ?");
        connection.on(
          "ReceiveNotification",
          (sender, receiver, type, copyChannelId) => {
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
                  {
                    sender: sender,
                    receiver: receiver,
                    type: type,
                    channelId: copyChannelId,
                  },
                ];
              }
            });
          }
        );

        return () => {
          connection!.off("ReceiveNotification");
        };
      } else {
        console.error("Nu esti autentificat boss");
      }
    };

    setTimeout(receiveNotifications, 5000);
  }, [isAuthenticated]);

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
        channelId,
        setChannelId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
