import {
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  VirtualizedList,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useSelector } from "react-redux";
import { firestoreDB } from "../config/firebase.config";
import { selectUser } from "../context/slices/userSlice";
import { ChatMessage } from "../components";
import ChatMessageCreate from "../components/ChatMessageCreate";
import ChatMessageNav from "../components/ChatMessageNav";

const ChatScreen = ({ route }) => {
  const { room } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(null);
  const flatListRef = useRef();
  const user = useSelector(selectUser);

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

  const chatMessages = messages?.map((item) => (
    <ChatMessage
      key={item._id + item.user.id}
      message={item.message}
      recordingURL={item.recordingURL}
      userEmail={user.providerData.email}
      timeStamp={item.timeStamp}
      email={item.user.providerData.email}
      profilePic={item.user.providerData.profilPic}
    />
  ));

  return (
    <View className="flex-1">
      {/* top */}
      <ChatMessageNav chatName={room.chatName} />

      {/* bottom */}
      <View className="w-full  bg-white px-4 py-6 rounded-t-[50px] flex-1 -mt-10">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={160}
        >
          {isLoading ? (
            <View>
              <ActivityIndicator size="large" color="pink" />
            </View>
          ) : (
            <VirtualizedList
              data={chatMessages}
              initialNumToRender={20}
              renderItem={({ item }) => item}
              keyExtractor={(item) => item.key}
              getItemCount={() => chatMessages.length}
              getItem={(data, index) => data[index]}
              ref={flatListRef}
              onContentSizeChange={() =>
                flatListRef.current.scrollToEnd({ animated: false })
              }
              removeClippedSubviews={true}
            />
          )}
          <ChatMessageCreate
            setMessage={setMessage}
            message={message}
            room={room}
          />
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ChatScreen;
