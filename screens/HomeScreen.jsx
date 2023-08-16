import { View, Text } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../context/slices/userSlice";

const HomeScreen = () => {
  const user = useSelector(selectUser);

  return (
    <View>
      <Text>Home</Text>
    </View>
  );
};

export default HomeScreen;
