import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ChatMessageNav = ({ chatName }) => {
  const navigation = useNavigation();
  return (
    <LinearGradient
      className="w-full px-4 py-6 flex-[0.35] "
      colors={["#b79adb", "pink"]}
      start={{ x: 0.4, y: 0.1 }}
      locations={[0.4, 0.9]}
    >
      <View className="flex-row items-center justify-between w-full  px-4  py-4">
        {/* go back */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>

        {/* profile */}
        <View className="flex-row justify-center items-center space-x-3">
          <View className="w-14 h-14 rounded-full flex items-center border-2 border-white justify-center p-1 ">
            <Feather name="user" size={30} color="white" />
          </View>
          <View>
            <Text
              numberOfLines={1}
              className="truncate... w-20 text-gray-50 text-base capitalize font-semibold"
            >
              {chatName}
            </Text>
            <Text className=" text-gray-50">"online"</Text>
          </View>
        </View>

        {/* icons */}
        <View className="flex-row items-center justify-center space-x-3">
          <TouchableOpacity>
            <Ionicons name="videocam" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity>
            <FontAwesome name="phone" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default ChatMessageNav;
