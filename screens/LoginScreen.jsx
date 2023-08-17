import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { BGImage } from "../assets";
import { UserInput } from "../components";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";

const LoginScreen = () => {
  const screenWidth = Math.round(Dimensions.get("window").width);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  const navigation = useNavigation();

  const handleLogin = async () => {
    if (getEmailValidationStatus && email !== "") {
      await signInWithEmailAndPassword(firebaseAuth, email, password)
        .then((userCred) => {
          if (userCred) {
            getDoc(doc(firestoreDB, "users", userCred.user.uid)).then(
              (docSnap) => {
                if (docSnap.exists()) {
                }
              }
            );
          }
        })
        .catch((err) => {
          if (err.message.includes("wrong-password")) {
            setAlert(true);
            setAlertMsg("Invalid Password");
          } else if (err.message.includes("user-not-found")) {
            setAlert(true);
            setAlertMsg("User not found");
          } else {
            setAlert(true);
            setAlertMsg("Something went wrong, try again later");
          }
          setInterval(() => {
            setAlert(false);
          }, 2000);
        });
    }
  };

  return (
    <View className="flex-1 items-center justify-start ">
      {/* background */}

      <Image
        source={BGImage}
        className="h-96"
        style={{ width: screenWidth }}
        resizeMode="cover"
      />
      {/* main view */}

      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "start",
        }}
        className="w-full h-full bg-white rounded-tl-[90px]  py-6 px-6 space-y-6 -mt-44"
      >
        {/* logo */}
        <AntDesign name="login" size={70} color="pink" />
        <Text className="text-primaryText text-xl font-semibold">
          Welcome Back!
        </Text>

        <View className=" w-full items-center justify-center">
          {/* alert */}
          {alert && <Text className="text-base text-red-600">{alertMsg}</Text>}

          {/* email input */}
          <UserInput
            placeHolder={"Email"}
            isPass={false}
            setStateValue={setEmail}
            iconName={"email-outline"}
            setGetEmailValidationStatus={setGetEmailValidationStatus}
          />
          {/* password input */}
          <UserInput
            placeHolder={"Password"}
            isPass={true}
            setStateValue={setPassword}
            iconName={"lock-outline"}
          />

          {/* login button */}
          <TouchableOpacity
            onPress={handleLogin}
            className="w-full justify-center items-center py-2 bg-pink-400 rounded-xl my-2 "
          >
            <Text className="py-2 text-white text-xl font-semibold tracking-widest">
              Sign In
            </Text>
          </TouchableOpacity>

          {/* register */}
          <View className="w-fullflex-row  items-center justify-center space-x-2 py-5">
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
      </ScrollView>
    </View>
  );
};

export default LoginScreen;
