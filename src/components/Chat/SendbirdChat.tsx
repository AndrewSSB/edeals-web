import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import "@sendbird/uikit-react/dist/index.css";
import { CustomizeApp } from "./CustomizeApp";
import "./SendbirdChat.css";

interface SendbirdChatProps {
  applicationId: string;
  userId: string;
  accessToken: string;
}

export const SendbirdChat = (props: SendbirdChatProps) => {
  return (
    <div className="SendBird">
      <SendbirdProvider
        appId={props.applicationId}
        userId={props.userId}
        accessToken={props.accessToken}
      >
        <CustomizeApp />
      </SendbirdProvider>
    </div>
  );
};
