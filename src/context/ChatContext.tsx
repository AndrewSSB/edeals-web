import React, { createContext, useState } from "react";

type ChatContextProps = {
  children: React.ReactNode;
};

type ChatContextType = {
  isChatOpen: boolean;
  setChatOpen: (value: boolean) => void;
};

// Create a new context
export const ChatContext = createContext<ChatContextType>(
  {} as ChatContextType
);

// Create a context provider component
export const ChatContextProvider = ({ children }: ChatContextProps) => {
  const [isChatOpen, setChatOpen] = useState(false);

  return (
    <ChatContext.Provider value={{ isChatOpen, setChatOpen }}>
      {children}
    </ChatContext.Provider>
  );
};
