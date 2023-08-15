import { View, Text, ActivityIndicator } from "react-native";
import React from "react";

import { FontAwesome5 } from "@expo/vector-icons";

const SplashScreen = () => {
  return (
    <View className="flex-1 justify-center items-center gap-y-24">
      <FontAwesome5 name="door-open" size={90} color="purple" />
      <ActivityIndicator size={"large"} color="purple" />
    </View>
  );
};

export default SplashScreen;
