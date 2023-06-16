import React, {
  useState,
  useEffect,
  useRef,
  RefObject,
  CSSProperties,
} from "react";
import { NoHoverIconButton } from "../Navbar/NavbarElements";
import { Box, Card, Dialog, Typography } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import TelegramIcon from "@mui/icons-material/Telegram";
import CloseIcon from "@mui/icons-material/Close";
import "./Chat.css";
import { handleSendMessage } from "./SignalR";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { ChatMessage } from "../ProductDetails/ProductDetails";
import instance from "../../API/instance";
import { ApiUrls } from "../../API/Routes";

interface ChatBoxProps {
  selectedUser: string;
  closeChat: () => void;
  connection: HubConnection | null;
  myUsername: string;
  channelId: string;
}

export interface message {
  sender: string;
  message: string;
  date: string;
}

const myChats: CSSProperties = {
  marginRight: "20px",
  marginTop: "10px",
  textAlign: "right",
};

const otherChats: CSSProperties = {
  marginLeft: "20px",
  textAlign: "left",
};

export const ChatBox = (props: ChatBoxProps) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<message[]>([]);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await instance.get(
        ApiUrls.messages + `/${props.channelId}`
      );

      setMessages(
        response.data.map((message: any) => {
          return {
            sender: message.username,
            message: message.message,
            date: message.date,
          };
        })
      );
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    if (
      props.connection &&
      props.connection.state === HubConnectionState.Connected
    ) {
      props.connection.on("ReceiveMessage", (sender, receivedMessage, date) => {
        const newMessage = { sender, message: receivedMessage, date };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        props.connection!.off("ReceiveMessage");
      };
    } else {
      console.error("No connection to chatHub yet!");
    }
  }, []);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card
      style={{
        width: "300px",
        height: "400px",
        boxShadow: "0px 4px 10px rgba(100, 111, 203, 0.4)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#eaeaea",
          height: "40px",
          borderRadius: "0 0 5px 5px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <NoHoverIconButton>
          <RemoveIcon />
        </NoHoverIconButton>
        <Typography>{props.selectedUser}</Typography>
        <NoHoverIconButton onClick={props.closeChat}>
          <CloseIcon />
        </NoHoverIconButton>
      </Box>
      <Box
        ref={messageContainerRef}
        sx={{
          backgroundColor: "#F7F7F7",
          flex: 1,
          borderRadius: "5px 5px 0 0",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {messages.map((receivedMessage, index) => {
          const time = new Date(receivedMessage.date);
          const hour = time.getHours();
          const minutes = time.getMinutes();
          const formattedTime = `${hour}:${
            minutes < 10 ? "0" + minutes : minutes
          }`;

          return (
            <div
              key={index}
              style={
                receivedMessage.sender === props.myUsername
                  ? myChats
                  : otherChats
              }
            >
              {receivedMessage.message}{" "}
              <span style={{ fontSize: "10px", fontStyle: "italic" }}>
                {formattedTime}
              </span>
            </div>
          );
        })}
      </Box>
      <Box
        sx={{
          backgroundColor: "#F7F7F7",
          marginTop: "auto",
          height: "60px",
          borderRadius: "5px 5px 0 0",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <input
          id="message-input"
          type="text"
          value={message}
          placeholder="Scrie un mesaj"
          onChange={(e) => setMessage(e.target.value)}
        />
        <NoHoverIconButton
          sx={{
            marginLeft: "5px",
            marginRight: "5px",
          }}
          onClick={() => {
            handleSendMessage(
              props.connection!,
              props.channelId,
              props.myUsername,
              message
            );
            setMessage("");
          }}
        >
          <TelegramIcon sx={{ color: "#646FCB" }} />
        </NoHoverIconButton>
      </Box>
    </Card>
  );
};
