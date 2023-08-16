import { View, Text, ActivityIndicator } from "react-native";
import React, { useLayoutEffect } from "react";

import { FontAwesome5 } from "@expo/vector-icons";
import { firebaseAuth } from "../config/firebase.config";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";
import { useDispatch } from "react-redux";
import { setUser } from "../context/slices/userSlice";

const SplashScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    checkLoggedUser();
  }, []);

  const checkLoggedUser = async () => {
    firebaseAuth.onAuthStateChanged((userCred) => {
      if (userCred?.uid) {
        getDoc(doc(firestoreDB, "users", userCred?.uid))
          .then((docSnap) => {
            if (docSnap.exists()) {
              dispatch(setUser(docSnap.data()));
            }
          })
          .then(() => {
            setTimeout(() => {
              navigation.replace("HomeScreen");
            }, 2000);
          });
      } else {
        navigation.navigate("LoginScreen");
      }
    });
  };

  return (
    <View className="flex-1 justify-center items-center gap-y-24">
      <FontAwesome5 name="door-open" size={90} color="purple" />
      <ActivityIndicator size={"large"} color="purple" />
    </View>
  );
};

export default SplashScreen;
