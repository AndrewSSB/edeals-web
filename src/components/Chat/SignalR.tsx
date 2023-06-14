import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

interface message {
  sender: any;
  message: any;
}

export const ChatComponent = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState<message[]>([]);

  //   useEffect(() => {
  const connectToHub = async () => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7196/chat`, {})
      .build();

    connection.on("ReceiveMessage", (user, message) => {
      console.log(`${user} sent a message: ${message}`);
      const newMessage = { sender: user, message };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    setConnection(connection);

    connection
      .start()
      .then(function () {
        console.log("Connected!");
      })
      .catch(function (err) {
        return console.error(err.toString());
      });
  };
  //     connectToHub();
  //   }, []);

  const sendJoinChannel = async (
    connection: signalR.HubConnection | null,
    id: string
  ) => {
    if (
      connection &&
      connection.state === signalR.HubConnectionState.Connected
    ) {
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

  const sendLeaveChannel = async (
    connection: signalR.HubConnection | null,
    id: string
  ) => {
    if (
      connection &&
      connection.state === signalR.HubConnectionState.Connected
    ) {
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

  const handleSendMessage = (
    channelId: string,
    username: string,
    message: string
  ) => {
    if (
      connection &&
      connection.state === signalR.HubConnectionState.Connected
    ) {
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

  const disconnect = () => {
    if (connection) {
      connection.stop();
    }
    console.log("Disconected!");
  };

  return (
    <div>
      <h1>Chat Component</h1>
      <p>Status: {connection ? "Connected" : "Not connected"}</p>
      <button
        onClick={() =>
          sendJoinChannel(connection, "7d52b484-adbe-4540-9a54-560b92807f98")
        }
      >
        Join Channel
      </button>
      <button
        onClick={() =>
          sendLeaveChannel(connection, "7d52b484-adbe-4540-9a54-560b92807f98")
        }
      >
        Leave Channel
      </button>
      <button onClick={connectToHub}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
      <div>
        <div>
          {messages.map((msg, index) => (
            <div key={index}>
              <span>{msg.sender}: </span>
              <span>{msg.message}</span>
            </div>
          ))}
        </div>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={() =>
              handleSendMessage(
                "7d52b484-adbe-4540-9a54-560b92807f98",
                username,
                message
              )
            }
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
