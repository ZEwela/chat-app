import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../context/slices/userSlice";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { firestoreDB } from "../config/firebase.config";
import { doc, setDoc } from "firebase/firestore";

const AddToChatScreen = () => {
  const user = useSelector(selectUser);
  const navigation = useNavigation();
  const [addToChat, setAddToChat] = useState("");

  const createNewChat = async () => {
    let id = `${Date.now()}`;
    const _doc = {
      _id: id,
      user: user,
      chatName: addToChat,
    };
    if (addToChat !== "") {
      setDoc(doc(firestoreDB, "chats", id), _doc)
        .then(() => {
          setAddToChat("");
          navigation.navigate("HomeScreen");
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  return (
    <View className="flex-1">
      {/* top */}
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
          {/* user profile */}
          <View>
            <Image
              source={user?.profilPic}
              className="w-16 h-16"
              resizeMode="contain"
            />
          </View>
        </View>
      </LinearGradient>

      {/* bottom */}
      <View className="w-full  bg-white px-4 py-6 rounded-t-[50px] flex-1 -mt-10">
        <View className="w-full px-4 py-4">
          <View className="w-full px-4 flex-row items-center justify-between py-3 rounded-xl border border-grey-200">
            {/* icons */}
            <Ionicons name="ios-chatbubbles-outline" size={24} color="grey" />
            {/* textinpout */}
            <TextInput
              placeholder="Create a chat"
              placeholderTextColor={"#999"}
              value={addToChat}
              onChangeText={(text) => setAddToChat(text)}
              className="flex-1 text-lg text-primaryText  h-12 w-full ml-3"
            />
            {/* icon */}
            <TouchableOpacity onPress={createNewChat}>
              <MaterialIcons name="send" size={24} color="grey" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AddToChatScreen;
