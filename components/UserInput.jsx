import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";

const UserInput = ({ placeHolder, isPass, setStateValue, iconName }) => {
  const [value, setValue] = useState("");
  const [showPass, setShowPass] = useState(true);
  const handleTextChange = (text) => {
    setValue(text);
    setStateValue(text);
  };
  return (
    <>
      <View className="border border-pink-200 rounded-2xl px-4 py-6 flex-row items-center justify-between space-x-4 my-2">
        <MaterialCommunityIcons name={iconName} size={24} color="grey" />
        <TextInput
          className="flex-1 text-base text-primaryText font-semibold -mt-1"
          placeholder={placeHolder}
          value={value}
          onChangeText={handleTextChange}
          autoCapitalize="none"
          secureTextEntry={isPass && showPass}
        />
        {isPass && (
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Entypo
              name={`${showPass ? "eye" : "eye-with-line"}`}
              size={24}
              color="grey"
            />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default UserInput;
