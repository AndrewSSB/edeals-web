import { useEffect, useState, useContext } from "react";
import { ChatBox } from "../Chat/Chatbox";
import { Box } from "@mui/material";
import { UserContext } from "../../context/UserContext";
import { HubConnection } from "@microsoft/signalr";
import { styled } from "@mui/system";
import {
  connectToHub,
  sendJoinChannel,
  sendLeaveChannel,
} from "../Chat/SignalR";
import { Product } from "../../context/ProductsContext";

export interface ChatMessage {
  date: string;
  username: string;
  message: string;
  channelId: string;
}

export interface ProductDetailsProps {
  product?: Product;
}

export const ProductDetails = (props: ProductDetailsProps) => {
  const { userData } = useContext(UserContext);
  const [username, setUsername] = useState("Haideeee");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [channelId, setChannelId] = useState<string>("");

  useEffect(() => {
    const getConnection = async () => {
      try {
        const response = await connectToHub();

        setConnection(response);
      } catch {}
    };

    getConnection();
  }, []);

  const handleSelectedUser = async (user: string) => {
    setSelectedUser(user);

    try {
      setChannelId(userData.userName + "__" + user);
      await sendJoinChannel(connection, userData.userName + "__" + user);
    } catch {}
  };

  const handleCloseChat = async () => {
    setSelectedUser(null);

    await sendLeaveChannel(connection, channelId);
  };

  return (
    <div>
      <div onClick={() => handleSelectedUser("eneandrei")}>eneandrei</div>
      <div onClick={() => handleSelectedUser(username)}>{username}</div>
      <div onClick={() => handleSelectedUser("bogdan")}>bogdan</div>
      {selectedUser && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            zIndex: 9999,
          }}
        >
          <ChatBox
            selectedUser={selectedUser}
            closeChat={handleCloseChat}
            connection={connection}
            myUsername={userData.userName}
            channelId={channelId}
          />
        </div>
      )}
    </div>
  );
};
