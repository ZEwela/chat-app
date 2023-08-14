import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { BGImage } from "../assets";
import { UserInput } from "../components";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const screenWidth = Math.round(Dimensions.get("window").width);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  return (
    <View className="flex-1 items-center justify-start">
      <Image
        source={BGImage}
        className="h-96"
        style={{ width: screenWidth }}
        resizeMode="cover"
      />

      <View className="w-full h-full bg-white rounded-tl-[90px] items-center justify-start py-6 px-6 space-y-6 -mt-44">
        <AntDesign name="login" size={70} color="pink" />
        <Text className="text-primaryText text-xl font-semibold">
          Welcome Back!
        </Text>

        <View className="w-full items-center justify-center ">
          <UserInput
            placeHolder={"Email"}
            isPass={false}
            setStateValue={setEmail}
            iconName={"email-outline"}
          />

          <UserInput
            placeHolder={"Password"}
            isPass={true}
            setStateValue={setPassword}
            iconName={"lock-outline"}
          />

          <TouchableOpacity className="w-full flex py-2 bg-pink-400 rounded-xl justify-center items-center my-2 ">
            <Text className="py-2 text-white text-xl font-semibold tracking-widest">
              Sign In
            </Text>
          </TouchableOpacity>

          <View className="w-full flex-row  items-center justify-center space-x-2 py-5">
            <Text className="text-base text-primaryText">
              Don't have account?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("SignUpScreen")}
            >
              <Text className="text-base text-primaryBold font-semibold">
                Create Here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
