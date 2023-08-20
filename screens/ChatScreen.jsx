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
  FlatList,
  VirtualizedList,
} from "react-native";
import {
  Ionicons,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
  Entypo,
  Foundation,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import {} from "firebase/storage";
import { useSelector } from "react-redux";
import { firestoreDB } from "../config/firebase.config";
import { selectUser } from "../context/slices/userSlice";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { getSendAMessage } from "../actions/getSendAMessage";
import { ChatMessage } from "../components";

const ChatScreen = ({ route }) => {
  const navigation = useNavigation();
  const { room } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(null);
  const [recording, setRecording] = useState();
  const [recordUri, setRecordUri] = useState(undefined);

  const user = useSelector(selectUser);

  const sendAMessage = () => {
    if (message.length === 0 && recordUri === undefined) {
      return;
    }
    getSendAMessage(message, recordUri, setRecordUri, setMessage, room, user);
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

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const recordingUri = recording.getURI();
    let fileName = `recording-${Date.now()}.caf`;

    await FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "recordings/",
      { intermediates: true }
    );

    let uriPlace = FileSystem.documentDirectory + "recordings/" + `${fileName}`;

    await FileSystem.moveAsync({
      from: recordingUri,
      to: uriPlace,
    });

    setRecordUri(uriPlace);
    setRecording(undefined);
  };

  const chatMessages = messages?.map((item) => (
    <ChatMessage
      key={item._id + item.user.id}
      message={item}
      userEmail={user.providerData.email}
    />
  ));

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
            {isLoading ? (
              <>
                <View>
                  <ActivityIndicator size="large" color="pink" />
                </View>
              </>
            ) : (
              <VirtualizedList
                data={chatMessages}
                initialNumToRender={20}
                renderItem={({ item }) => item}
                keyExtractor={(item) => item.key}
                getItemCount={() => chatMessages.length}
                getItem={(data, index) => data[index]}
              />
            )}

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

                <TouchableOpacity
                  onPress={recording ? stopRecording : startRecording}
                >
                  <Entypo
                    name="mic"
                    size={24}
                    color={recording ? "green" : "black"}
                  />
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
