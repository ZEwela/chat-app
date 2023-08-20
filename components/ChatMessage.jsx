import { Image, Text, TouchableOpacity, View } from "react-native";
import { Foundation } from "@expo/vector-icons";
import { Audio } from "expo-av";
import React from "react";

const ChatMessage = React.memo(({ message, userEmail }) => {
  const playRecording = async (recordingURL) => {
    const playbackObject = new Audio.Sound();
    await playbackObject.loadAsync({
      uri: recordingURL,
    });
    await playbackObject.playAsync();
  };
  return (
    <>
      <View
        className={`m-1 flex ${
          userEmail === message?.user?.providerData?.email
            ? "self-end"
            : "self-start"
        } space-x-2 items-center justify-center`}
      >
        <View className="flex-row items-center justify-center space-x-2">
          {userEmail !== message?.user?.providerData?.email && (
            <Image
              source={message?.user?.profilPic}
              className="w-12 h-12 "
              resizeMode="cover"
            />
          )}
          <View
            className={`px-4 py-2 ${
              userEmail === message?.user?.providerData?.email
                ? "rounded-tl-2xl rounded-tr-2xl rounded-br-2xl bg-blue-50"
                : "rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-pink-50"
            }`}
          >
            {message?.recordingURL?.length > 0 && (
              <TouchableOpacity
                onPress={() => playRecording(message.recordingURL)}
                className="flex-row items-center justify-center space-x-2"
              >
                <Foundation name="sound" size={24} color="grey" />

                <Text>Play voice message</Text>
              </TouchableOpacity>
            )}
            {message?.message?.length > 0 && (
              <Text className="text-base font-medium">{message.message}</Text>
            )}
          </View>
        </View>
        <View
          className={`${
            userEmail === message?.user?.providerData?.email
              ? "self-end mr-3"
              : "self-start pl-5"
          } `}
        >
          {message?.timeStamp?.seconds && (
            <Text className="text-[12px]  font-medium">
              {new Date(
                parseInt(message?.timeStamp?.seconds) * 1000
              ).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </Text>
          )}
        </View>
      </View>
    </>
  );
});

export default ChatMessage;

// {
//   <View
//     key={msg._id}
//     className="flex  self-start  space-x-2 items-center justify-center"
//   >
//     <View className="flex-row items-center justify-center space-x-2">
//       <Image
//         source={msg?.user?.profilPic}
//         className="w-12 h-12 "
//         resizeMode="cover"
//       />
//       <View className=" px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl bg-blue-50">
//         {msg?.recordingURL?.length > 0 && (
//           <TouchableOpacity
//             onPress={() => playRecording(msg)}
//             className="flex-row items-center justify-center space-x-2"
//           >
//             <Foundation name="sound" size={24} color="grey" />

//             <Text>Play voice message</Text>
//           </TouchableOpacity>
//         )}
//         {msg?.message?.length > 0 && (
//           <Text className="text-base font-medium">{msg.message}</Text>
//         )}
//       </View>
//     </View>
//     <View className="self-start">
//       {msg?.timeStamp?.seconds && (
//         <Text className="text-[12px]  font-medium  pl-12 -mt-1 mb-1">
//           {new Date(
//             parseInt(msg?.timeStamp?.seconds) * 1000
//           ).toLocaleTimeString("en-US", {
//             hour: "numeric",
//             minute: "numeric",
//             hour12: true,
//           })}
//         </Text>
//       )}
//     </View>
//   </View>;
// }
