import { Alert, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";
import { Ionicons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { getSendAMessage } from "../actions/getSendAMessage";
import { getStopRecording } from "../actions/getStopRecording";
import { getStartRecording } from "../actions/getStartRecording";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../context/slices/userSlice";

const ChatMessageCreate = ({ message, setMessage, room }) => {
  const [recordUri, setRecordUri] = useState(undefined);
  const [recording, setRecording] = useState();

  const user = useSelector(selectUser);

  const sendAMessage = () => {
    if (message.length === 0 && recordUri === undefined) {
      return;
    }
    getSendAMessage(message, recordUri, setRecordUri, setMessage, room, user);
  };

  const handleRecording = () => {
    if (recordUri) {
      Alert.alert("Deleting recording", "Are you sure?", [
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
          style: "cancel",
        },
        { text: "OK", onPress: () => setRecordUri(undefined) },
      ]);

      return;
    }
    if (recording) {
      getStopRecording(recording, setRecordUri, setRecording);
    } else {
      getStartRecording(setRecording);
    }
  };

  return (
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
          onSubmitEditing={sendAMessage}
        />
        {recording && (
          <Toast
            visible={recording}
            position={0}
            shadow={false}
            animation={false}
            hideOnPress={true}
          >
            Recording...
          </Toast>
        )}
        <TouchableOpacity onPress={handleRecording}>
          {recordUri ? (
            <Entypo name="mic" size={24} color={"red"} />
          ) : (
            <Entypo
              name="mic"
              size={24}
              color={recording ? "green" : "black"}
            />
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="pl-2" onPress={sendAMessage}>
        <Ionicons name="send" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default ChatMessageCreate;
