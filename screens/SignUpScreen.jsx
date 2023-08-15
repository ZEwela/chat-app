import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { BGImage, avatars } from "../assets";
import { UserInput } from "../components";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { doc, setDoc } from "firebase/firestore";

const SignUpScreen = () => {
  const screenWidth = Math.round(Dimensions.get("window").width);
  const screenHeight = Math.round(Dimensions.get("window").height);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [isAvatarMenu, setIsAvatarMenu] = useState(false);
  const [avatar, setAvatar] = useState(avatars[0]?.image);
  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);

  const navigation = useNavigation();

  const handleAvatar = (item) => {
    setAvatar(item.image);
    setIsAvatarMenu(false);
  };

  const handleSignUp = async () => {
    if (getEmailValidationStatus && email !== "") {
      await createUserWithEmailAndPassword(firebaseAuth, email, password).then(
        (userCred) => {
          const data = {
            _id: userCred.user.uid,
            fullName: fullName,
            profilPic: avatar,
            providerData: userCred.user.providerData[0],
          };

          setDoc(doc(firestoreDB, "users", userCred.user.uid), data).then(
            () => {
              navigation.navigate("LoginScreen");
            }
          );
        }
      );
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

      {/* avatar menu */}
      {isAvatarMenu && (
        <View
          className="absolute inset-0 z-10"
          style={{ width: screenWidth, height: screenHeight }}
        >
          <ScrollView>
            <BlurView
              className="px-4 py-16 flex-row flex-wrap items-center justify-evenly"
              tint="light"
              intensity={40}
              style={{ width: screenWidth, height: screenHeight }}
            >
              {avatars?.map((item, id) => (
                <TouchableOpacity
                  onPress={() => handleAvatar(item)}
                  key={item._id}
                  className="w-20 h-20 m-3 p-1 border-2  border-primary rounded-full"
                >
                  <Image
                    source={item.image}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </BlurView>
          </ScrollView>
        </View>
      )}

      {/* main content */}

      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "start",
        }}
        className="w-full h-full bg-white rounded-tl-[90px]  py-6 px-6 space-y-6 -mt-44"
      >
        {/* logo */}
        <MaterialCommunityIcons
          name="folder-account-outline"
          size={70}
          color="pink"
        />
        <Text className="text-primaryText text-xl font-semibold">
          Join With Us!
        </Text>

        {/* avatar  */}
        <View className="w-full items-center justify-center ">
          <TouchableOpacity
            onPress={() => setIsAvatarMenu(true)}
            className="w-20 h-20 rounded-full p-1 mb-2 border-2 border-primary relative"
          >
            <Image
              source={avatar}
              className="w-full h-full"
              resizeMode="contain"
            />
            <View className="w-6 h-6 bg-primary rounded-full absolute top-0 right-0 items-center justify-center">
              <MaterialIcons name="edit" size={18} color="white" />
            </View>
          </TouchableOpacity>

          {/* full name user input */}
          <UserInput
            placeHolder={"Full Name"}
            isPass={false}
            setStateValue={setFullName}
            iconName={"account"}
          />

          {/* email user input */}
          <UserInput
            placeHolder={"Email"}
            isPass={false}
            setStateValue={setEmail}
            iconName={"email-outline"}
            setGetEmailValidationStatus={setGetEmailValidationStatus}
          />

          {/* password user input */}
          <UserInput
            placeHolder={"Password"}
            isPass={true}
            setStateValue={setPassword}
            iconName={"lock-outline"}
          />

          {/* signup button */}
          <TouchableOpacity
            onPress={handleSignUp}
            className="w-full flex py-2 bg-pink-400 rounded-xl justify-center items-center my-2 "
          >
            <Text className="py-2 text-white text-xl font-semibold tracking-widest">
              Sign In
            </Text>
          </TouchableOpacity>

          {/* login */}
          <View className="w-full flex-row  items-center justify-center space-x-2 py-6 mb-10">
            <Text className="text-base text-primaryText">Have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text className="text-base text-primaryBold font-semibold">
                Login Here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUpScreen;
