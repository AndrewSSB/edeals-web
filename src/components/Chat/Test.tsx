import {
  MentionType,
  MessageMetaArray,
  PushNotificationDeliveryOption,
  UserMessageCreateParams,
} from "@sendbird/chat/message";
import { OpenChannelCreateParams } from "@sendbird/chat/openChannel";
import SendBird, {
  OpenChannel,
  OpenChannelParams,
  UserMessage,
} from "sendbird";

const sendbird = new SendBird({
  appId: "1C60BCB2-8533-49C3-B140-EC377E9CF4FC",
});

interface UserConnections {
  fromUserId: string;
  toUserId: string;
}

export const Test = () => {
  //   const sendMessage = () => {
  //     const params: UserMessageCreateParams = {
  //       message: "TEXT_MESSAGE",
  //       customType: "CUSTOM_TYPE",
  //       data: "DATA",
  //       mentionType: MentionType.USERS,
  //       mentionedUserIds: ["Jeff", "Julia"], // Or mentionedUsers = Array<User>;
  //       metaArrays: [
  //         // A pair of key-value
  //         new MessageMetaArray("itemType", ["tablet"]),
  //         new MessageMetaArray("quality", ["best", "good"]),
  //       ],
  //       translationTargetLanguages: ["fe", "de"], // French and German
  //       pushNotificationDeliveryOption: PushNotificationDeliveryOption.DEFAULT, // Either DEFAULT or SUPPRESS
  //     };
  //     channel.sendUserMessage(params).onSucceeded((message: UserMessage) => {
  //       // A text message with detailed configuration is successfully sent to the channel.
  //       // By using userMessage.messageId, userMessage.message, userMessage.customType, and so on,
  //       // you can access the result object from the Sendbird server to check your UserMessageCreateParams configuration.
  //       // The current user can receive messages from other users through the onMessageReceived() method of an event handler.
  //       const messageId = sendMessage.messageId;

  //       // ...
  //     });
  //   };

  //   const connectToChannel = async (fromUserId: string, toUserId: string) => {
  //     var doesChannelExists = false;

  //     if (doesChannelExists) {
  //       // connect
  //     } else {
  //       const params: OpenChannelCreateParams = {
  //         name: NAME,
  //         channelUrl: UNIQUE_CHANNEL_URL,
  //         coverUrlOrImage: FILE | COVER_URL,
  //         operatorUserIds: ["Hoon", "Doo"],
  //         data: DATA,
  //         customType: CUSTOM_TYPE,
  //         // ...
  //       };
  //       const test = SendBird.getInstance();

  //       const channel: OpenChannel = await sendbird.OpenChannel.createChannel(
  //         params
  //       );
  //     }
  //   };

  const setConnection = async (userId: string, accessToken: string) => {
    try {
      const user = await sendbird.connect(userId, accessToken);
    } catch (error) {
      console.error("Failed with error: ", error);
    }
  };

  return (
    <div>
      <button onClick={() => setConnection("TEST", "")}>Apasa</button>
    </div>
  );
};
