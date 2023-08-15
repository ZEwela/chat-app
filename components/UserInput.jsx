import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
  MaterialCommunityIcons,
  Entypo,
  FontAwesome,
} from "@expo/vector-icons";

const UserInput = ({
  placeHolder,
  isPass,
  setStateValue,
  iconName,
  setGetEmailValidationStatus,
}) => {
  const [value, setValue] = useState("");
  const [showPass, setShowPass] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleTextChange = (text) => {
    if (placeHolder === "Email") {
      // https://emailregex.com/index.html
      const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      const status = emailRegex.test(value);
      setIsEmailValid(status);
      setGetEmailValidationStatus(true);
    }
    setValue(text);
    setStateValue(text);
  };
  return (
    <>
      <View
        className={`border  rounded-2xl px-4 py-6 flex-row items-center justify-between space-x-4 my-2 ${
          !isEmailValid && placeHolder === "Email" && value.length > 0
            ? "border-red-500"
            : "border-pink-200"
        }`}
      >
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
