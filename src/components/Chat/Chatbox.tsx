import React, {
  useState,
  useEffect,
  useRef,
  CSSProperties,
  useContext,
} from "react";
import { NoHoverIconButton } from "../Navbar/NavbarElements";
import { Box, Card, Typography } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import TelegramIcon from "@mui/icons-material/Telegram";
import CloseIcon from "@mui/icons-material/Close";
import "./Chat.css";
import { handleSendMessage } from "./SignalR";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import instance from "../../API/instance";
import { UserContext } from "../../context/UserContext";
import * as signalR from "@microsoft/signalr";
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
  receiver: string;
  message: string;
  date: string;
}

const myChats: CSSProperties = {
  marginRight: "5px",
  marginLeft: "45px",
  textAlign: "right",
  whiteSpace: "pre-wrap",
  wordWrap: "break-word",
  overflowWrap: "break-word",
};

const otherChats: CSSProperties = {
  marginLeft: "10px",
  marginRight: "45px",
  textAlign: "left",
  whiteSpace: "pre-wrap",
  wordWrap: "break-word",
};

const myMessages: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  marginTop: "10px",
};

const otherPersonMessages: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  marginTop: "10px",
};

export const ChatBox = (props: ChatBoxProps) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<message[]>([]);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await instance.get(
          ApiUrls.messages + `/${props.channelId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        setMessages(
          response.data.map((message: any) => {
            return {
              sender: message.sender,
              receiver: message.receiver,
              message: message.message,
              date: message.date,
            };
          })
        );
      } catch (err: any) {
        console.error(err);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    if (
      props.connection &&
      props.connection.state === HubConnectionState.Connected
    ) {
      props.connection.on(
        "ReceiveMessage",
        (sender, receiver, receivedMessage, date) => {
          const newMessage = {
            sender: sender,
            receiver: receiver,
            message: receivedMessage,
            date,
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      );

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
          backgroundColor: "#white",
          flex: 1,
          borderRadius: "5px 5px 0 0",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "5px",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          ></div>
        )}
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
                receivedMessage.sender !== props.selectedUser
                  ? myMessages
                  : otherPersonMessages
              }
            >
              {receivedMessage.sender !== props.myUsername && (
                <div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontStyle: "italic",
                    }}
                  >
                    {formattedTime}
                  </span>
                </div>
              )}

              <div
                style={
                  receivedMessage.sender === props.myUsername
                    ? myChats
                    : otherChats
                }
              >
                {receivedMessage.message}{" "}
              </div>
              {receivedMessage.sender === props.myUsername && (
                <div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontStyle: "italic",
                    }}
                  >
                    {formattedTime}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </Box>
      <Box
        sx={{
          backgroundColor: "#F7F7F7",
          marginTop: "auto",
          height: "60px",
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage(
                props.connection!,
                props.channelId,
                props.myUsername,
                props.selectedUser,
                message
              );
              setMessage("");
            }
          }}
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
              props.selectedUser,
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
