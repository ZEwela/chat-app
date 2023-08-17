import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";
import {
  Ionicons,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  querySnapShot,
  orderBy,
  serverTimestamp,
  query,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { firestoreDB } from "../config/firebase.config";
import { selectUser } from "../context/slices/userSlice";

const ChatScreen = ({ route }) => {
  const navigation = useNavigation();
  const { room } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(null);
  const user = useSelector(selectUser);

  const sendAMessage = async () => {
    const timeStamp = serverTimestamp();
    let id = `${Date.now()}`;
    const _doc = {
      _id: id,
      roomId: room._id,
      timeStamp: timeStamp,
      message: message,
      user: user,
    };

    setMessage("");
    await addDoc(
      collection(doc(firestoreDB, "chats", room._id), "messages"),
      _doc
    )
      .then(() => {})
      .catch((err) => alert(err));
  };

  useEffect(() => {
    const msgQuery = query(
      collection(firestoreDB, "chats", room?._id, "messages"),
      orderBy("timeStamp", "asc")
    );

    const unsubscribe = onSnapshot(msgQuery, (querySnapShot) => {
      const updatedMessages = querySnapShot.docs.map((doc) => doc.data());
      setMessages(updatedMessages);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);
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
                {room.chatName}
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

      {/* bottom */}
      <View className="w-full  bg-white px-4 py-6 rounded-t-[50px] flex-1 -mt-10">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={160}
        >
          <>
            <ScrollView>
              {isLoading ? (
                <>
                  <View>
                    <ActivityIndicator size="large" color="pink" />
                  </View>
                </>
              ) : (
                <>
                  {messages?.map((msg) =>
                    msg?.user.providerData?.email ===
                    user.providerData.email ? (
                      <>
                        <View key={msg._id} className="m-1">
                          <View className=" self-end px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-pink-50">
                            <Text className="text-base font-medium">
                              {msg.message}
                            </Text>
                          </View>

                          <View className="self-end">
                            {msg?.timeStamp?.seconds && (
                              <Text className="text-[12px]  font-medium">
                                {new Date(
                                  parseInt(msg?.timeStamp?.seconds) * 1000
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
                    ) : (
                      <>
                        <View
                          key={msg._id}
                          className="flex  self-start  space-x-2 items-center justify-center"
                        >
                          <View className="flex-row items-center justify-center space-x-2">
                            <Image
                              source={msg?.user?.profilPic}
                              className="w-12 h-12 "
                              resizeMode="cover"
                            />
                            <View className=" px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl bg-blue-50">
                              <Text className="text-base font-medium">
                                {msg.message}
                              </Text>
                            </View>
                          </View>
                          <View className="self-start">
                            {msg?.timeStamp?.seconds && (
                              <Text className="text-[12px]  font-medium  pl-12 -mt-1 mb-1">
                                {new Date(
                                  parseInt(msg?.timeStamp?.seconds) * 1000
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
                    )
                  )}
                </>
              )}
            </ScrollView>

            <View className="flex-row items-center justify-center w-full px-6 space-x-2 pt-4">
              <View className="flex-row items-center justify-between bg-pink-50 rounded-2xl  space-x-4  px-4 py-2">
                <TouchableOpacity>
                  <MaterialCommunityIcons
                    name="emoticon-happy-outline"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>

                <TextInput
                  className="flex-1 h-8 text-base text-primaryText font-semibold"
                  placeholder="Type here..."
                  placeholderTextColor={"grey"}
                  value={message}
                  onChangeText={(text) => setMessage(text)}
                />

                <TouchableOpacity>
                  <Entypo name="mic" size={24} color="black" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity className="pl-2" onPress={sendAMessage}>
                <Ionicons name="send" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ChatScreen;
