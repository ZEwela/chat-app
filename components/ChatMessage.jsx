import { Image, Text, TouchableOpacity, View } from "react-native";
import { Foundation } from "@expo/vector-icons";
import { Audio } from "expo-av";
import React, { memo } from "react";

const ChatMessage = ({
  message,
  email,
  userEmail,
  timeStamp,
  profilePic,
  recordingURL,
}) => {
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
          userEmail === email ? "self-end" : "self-start"
        } space-x-2 items-center justify-center`}
      >
        <View className="flex-row items-center justify-center space-x-2">
          {userEmail !== email && (
            <Image
              source={profilePic}
              className="w-12 h-12 "
              resizeMode="cover"
            />
          )}
          <View
            className={`px-4 py-2 ${
              userEmail === email
                ? "rounded-tl-2xl rounded-tr-2xl rounded-br-2xl bg-blue-50"
                : "rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-pink-50"
            }`}
          >
            {recordingURL?.length > 0 && (
              <TouchableOpacity
                onPress={() => playRecording(recordingURL)}
                className="flex-row items-center justify-center space-x-2"
              >
                <Foundation name="sound" size={24} color="grey" />

                <Text>Play voice message</Text>
              </TouchableOpacity>
            )}
            {message?.length > 0 && (
              <Text className="text-base font-medium">{message}</Text>
            )}
          </View>
        </View>
        <View
          className={`${
            userEmail === email ? "self-end mr-3" : "self-start pl-5"
          } `}
        >
          {timeStamp?.seconds && (
            <Text className="text-[12px]  font-medium">
              {new Date(parseInt(timeStamp?.seconds) * 1000).toLocaleTimeString(
                "en-US",
                {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }
              )}
            </Text>
          )}
        </View>
      </View>
    </>
  );
};

export default memo(ChatMessage);
