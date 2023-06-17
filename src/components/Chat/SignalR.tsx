import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { ChatBox } from "./Chatbox";

interface message {
  sender: any;
  message: any;
}
// Realizarea conexiunii dintre client și server
export const connectToHub = async () => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`http://40.113.124.53:5002/chat`, {})
    .build();

  connection
    .start()
    .then(function () {
      console.log("Connected!");
    })
    .catch(function (err) {
      return console.error(err.toString());
    });

  return connection;
};

// Create unei camere private de comunicare
export const sendJoinChannel = async (
  connection: signalR.HubConnection | null,
  id: string
) => {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    try {
      await connection.send("JoinChannel", id);
      console.log("Enterd channel!");
    } catch (e) {
      console.error(e);
    }
  } else {
    console.error("No connection to chatHub yet!");
  }
};

// Parăsirea cemerei private
export const sendLeaveChannel = async (
  connection: signalR.HubConnection | null,
  id: string
) => {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    try {
      await connection.send("LeaveChannel", id);
      console.log("Leaved channel!");
    } catch (e) {
      console.error(e);
    }
  } else {
    console.error("No connection to chatHub yet!");
  }
};

// Trimiterea mesajelor
export const handleSendMessage = (
  connection: signalR.HubConnection,
  channelId: string,
  username: string,
  message: string
) => {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    connection
      .invoke("SendMessage", channelId, username, message)
      .then(() => {
        console.log("Message sent successfully.");
      })
      .catch((error) => {
        console.error(`Failed to send message: ${error}`);
      });
  } else {
    console.error("No connection to chatHub yet!");
  }
};

export const disconnect = (connection: signalR.HubConnection) => {
  if (connection) {
    connection.stop();
  }
  console.log("Disconected!");
};

export const ChatComponent = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState<message[]>([]);

  const users = {
    firstName: "bogdan",
    lastName: "grecu",
  };

  useEffect(() => {
    if (
      connection &&
      connection.state === signalR.HubConnectionState.Connected
    ) {
      connection.on("ReceiveMessage", (sender, receivedMessage) => {
        const newMessage = { sender, message: receivedMessage };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        connection.off("ReceiveMessage");
      };
    } else {
      console.error("No connection to chatHub yet!");
    }
  }, []);

  return <div>sal</div>;
};
