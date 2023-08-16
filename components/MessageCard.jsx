import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import React from "react";

const MessageCard = () => {
  return (
    <TouchableOpacity className="w-full flex-row items-center justify-start py-2  text-primaryText">
      {/* images */}
      <View className="w-16 h-16 rounded-full flex items-center border-2 border-primary justify-center p-1 ">
        <Feather name="user" size={30} color="black" />
      </View>
      {/* title */}
      <View className="flex-1 items-start justify-center ml-3">
        <Text className=" text-base font-semibold capitalize ">Some title</Text>
        <Text className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
          beatae....
        </Text>
      </View>
      {/* timestamp */}
      <Text className="font-semibold px-2 text-base text-primary"> 27 min</Text>
    </TouchableOpacity>
  );
};

export default MessageCard;
