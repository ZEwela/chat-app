import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../context/slices/userSlice";
import { useNavigation } from "@react-navigation/native";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import { resetUser } from "../context/slices/userSlice";
import { firebaseAuth } from "../config/firebase.config";

const ProfileScreen = () => {
  const user = useSelector(selectUser);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await firebaseAuth
      .signOut()
      .then(() => {
        dispatch(resetUser());
        navigation.replace("LoginScreen");
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <View className="flex-1">
      <View className="flex w-full  px-6  pt-12">
        {/* go back */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color="grey" />
        </TouchableOpacity>
      </View>

      {/* avatar*/}
      <View className="w-full flex items-center justify-center my-8 space-y-1">
        <View className="w-17 h-17 rounded-full flex items-center border-2 border-primary justify-center p-1 mb-4 ">
          <Image
            source={user?.profilPic}
            className="w-[100px] h-[100px]"
            resizeMode="cover"
          />
        </View>

        {/* full name */}
        <Text
          numberOfLines={1}
          className="truncate...  text-purple-600  text-lg  capitalize font-bold"
        >
          {user?.fullName}
        </Text>

        {/* email */}
        <Text
          numberOfLines={1}
          className="truncate...   text-grey  text-sm  font-semibold"
        >
          {user?.providerData.email}
        </Text>
      </View>

      {/* icons */}
      <View className="flex-row items-center justify-between mx-12 ">
        <View className="flex space-y-1 items-center justify-center">
          <TouchableOpacity className="w-14 h-14  justify-center items-center rounded-lg bg-pink-300">
            <Ionicons name="chatbox" size={26} color="white" />
          </TouchableOpacity>
          <Text className="text-[11px]">Message</Text>
        </View>
        <View className="flex space-y-1 items-center justify-center">
          <TouchableOpacity className="w-14 h-14  justify-center items-center rounded-lg bg-pink-300">
            <Ionicons name="videocam" size={26} color="white" />
          </TouchableOpacity>
          <Text className="text-[11px]">Video Call</Text>
        </View>
        <View className="flex space-y-1 items-center justify-center">
          <TouchableOpacity className="w-14 h-14  justify-center items-center rounded-lg bg-pink-300">
            <FontAwesome name="phone" size={26} color="white" />
          </TouchableOpacity>
          <Text className="text-[11px] text-">Call</Text>
        </View>
      </View>

      {/* options */}
      <View className="flex my-8 mx-12 space-y-4 ">
        <TouchableOpacity className="flex-row  w-full items-center justify-between">
          <View className="flex-row items-center space-x-6 ">
            <Ionicons name="shield" size={24} color="grey" />
            <Text className="text-gray-600 font-semibold text-base">
              Privacy
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={30} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row  w-full items-center justify-between">
          <View className="flex-row items-center space-x-6 ">
            <Entypo name="chat" size={24} color="gray" />
            <Text className="text-gray-600 font-semibold text-base">
              Groups
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={30} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row  w-full items-center justify-between">
          <View className="flex-row items-center space-x-6 ">
            <Entypo name="folder-images" size={24} color="gray" />
            <Text className="text-gray-600 font-semibold text-base">
              Media & Downloads
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={30} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row  w-full items-center justify-between">
          <View className="flex-row items-center space-x-6 ">
            <MaterialCommunityIcons name="account-cog" size={24} color="gray" />
            <Text className="text-gray-600 font-semibold text-base">
              Account
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={30} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <View className="flex-1 items-center justify-center ">
        <TouchableOpacity
          onPress={handleLogout}
          className="border border-purple-500 rounded-lg p-2"
        >
          <Text className="text-purple-600 font-bold text-xl">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;
