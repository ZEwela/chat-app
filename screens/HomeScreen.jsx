import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../context/slices/userSlice";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { MessageCard } from "../components";
import { useNavigation } from "@react-navigation/native";
import {
  QuerySnapShot,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";

const HomeScreen = () => {
  const user = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const chatQuery = query(
      collection(firestoreDB, "chats"),
      orderBy("_id", "desc")
    );

    const unsubscribe = onSnapshot(chatQuery, (QuerySnapShot) => {
      const chatRooms = QuerySnapShot.docs.map((doc) => doc.data());
      setChats(chatRooms);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  console.log(user);
  return (
    <View className="flex-1">
      <SafeAreaView>
        <View className="w-full flex-row items-center justify-between px-4 py-10">
          <Entypo name="chat" size={60} color="pink" />
          <TouchableOpacity className="w-16 h-16 rounded-full border border-primary flex items-center justify-center">
            <Image
              source={user?.profilPic}
              className="w-full h-full"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
        {/* add to chat */}
        <ScrollView className="w-full px-4 pt-4">
          <View className="w-full">
            {/* message title and add */}
            <View className="w-full  flex-row  items-center justify-between px-2">
              <Text className="text-primaryTexttext-base font-extrabold pb-2">
                Message
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("AddToChatScreen")}
              >
                <Ionicons name="chatbox" size={30} color="purple" />
              </TouchableOpacity>
            </View>

            {/* chat room card */}
            {isLoading ? (
              <>
                <View className="w-full  flex items-center justify-center mt-10">
                  <ActivityIndicator size="large" color="purple" />
                </View>
              </>
            ) : (
              <>
                {chats && chats?.length > 0 ? (
                  <>
                    {chats?.map((room) => (
                      <MessageCard key={room._id} room={room} />
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
