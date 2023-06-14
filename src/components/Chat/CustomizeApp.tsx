import { GroupChannel } from "@sendbird/chat/groupChannel";
import { ChannelList, Channel, ChannelSettings } from "@sendbird/uikit-react";
import { useState } from "react";
import "./SendbirdChat.css";

export const CustomizeApp = ({}) => {
  const [currentChannel, setCurrentChannel] = useState<GroupChannel | null>(
    null
  );
  const currentChannelUrl = currentChannel ? currentChannel.url : "";
  const [showSettings, setShowSettings] = useState(false);

  var channelChatDiv = document.getElementsByClassName(
    "channel-chat"
  )[0] as HTMLElement;

  const renderSettingsBar = () => {
    channelChatDiv.style.width = "52%";
    channelChatDiv.style.cssFloat = "left";
  };

  const hideSettingsBar = () => {
    channelChatDiv.style.width = "76%";
    channelChatDiv.style.cssFloat = "right";
  };

  return (
    <div className="channel-wrap">
      <div className="channel-list">
        <ChannelList
          onChannelSelect={(channel) => {
            setCurrentChannel(channel);
          }}
        />
      </div>
      <div className="channel-chat">
        <Channel
          channelUrl={currentChannelUrl}
          onChatHeaderActionClick={() => {
            setShowSettings(!showSettings);
            renderSettingsBar();
          }}
        />
      </div>
      {showSettings && (
        <div className="channel-settings">
          <ChannelSettings
            channelUrl={currentChannelUrl}
            onCloseClick={() => {
              setShowSettings(false);
              hideSettingsBar();
            }}
          />
        </div>
      )}
    </div>
  );
};
