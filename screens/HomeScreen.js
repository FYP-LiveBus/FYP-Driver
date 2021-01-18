import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import Swiper from "react-native-swiper";
import { useTheme } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import { Title } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import * as firebase from "firebase";
import "firebase/firestore";
import { set } from "react-native-reanimated";

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();

  const [routeDetails, setRouteDetails] = React.useState({});

  const [busDetails, setBusDetails] = React.useState({});

  const theme = useTheme();

  let [user, setUser] = React.useState({});

  useEffect(() => {
    setTimeout(async () => {
      try {
        let userData = await AsyncStorage.getItem("userObject");
        let user1 = JSON.parse(userData);
        axios
          .get(
            `https://livebusapi.herokuapp.com/api/admin/routes/${user1.username}`
          )
          .then((response) => {
            let r = response.data;
            axios
              .get(
                `https://livebusapi.herokuapp.com/api/admin/buses/getByNo/${r.busNo}`
              )
              .then((resp) => {
                let b = resp.data;
                setBusDetails(b);
                setRouteDetails(response.data);
              })
              .catch((e) => alert("Bo bus is assigned to this route"));
          })
          .catch((err) => alert("No route is assigned you"));
        setUser(user1);
      } catch (e) {
        console.log(e);
      }
    }, 1000);
  }, []);

  // Push Notification
  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    (() => registerForPushNotificationsAsync())();
  }, []);

  // const registerForPushNotificationsAsync = async () => {
  //   let token;
  //   if (Constants.isDevice) {
  //     const { status: existingStatus } = await Permissions.getAsync(
  //       Permissions.NOTIFICATIONS
  //     );
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== "granted") {
  //       const { status } = await Permissions.askAsync(
  //         Permissions.NOTIFICATIONS
  //       );
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== "granted") {
  //       alert("Failed to get push token for push notification!");
  //       return;
  //     }
  //     token = (await Notifications.getExpoPushTokenAsync()).data;
  //     console.log(token);
  //   } else {
  //     alert("Must use physical device for Push Notifications");
  //   }

  //   const res = await firebase
  //     .firestore()
  //     .collection("Tokens/")
  //     .doc(user._id)
  //     .set({ token });

  //   if (Platform.OS === "android") {
  //     Notifications.setNotificationChannelAsync("default", {
  //       name: "default",
  //       importance: Notifications.AndroidImportance.MAX,
  //       vibrationPattern: [0, 250, 250, 250],
  //       lightColor: "#FF231F7C",
  //     });
  //   }

  //   return token;
  // };

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("You need to give access in order to recieve notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    const res = await firebase
      .firestore()
      .collection("Tokens")
      .doc(user._id)
      .set({ token });

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };

  const startHandler = () => {
    if (Object.keys(routeDetails).length == 0) {
      Alert.alert(
        "Error",
        "You cannot start trip because you have no assigned route"
      );
    } else {
      Alert.alert(
        "Confirmation",
        "Are you sure?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () =>
              navigation.navigate("Explore", {
                user,
                routeDetails,
                busDetails,
              }),
          },
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <View style={styles.sliderContainer}>
        <Swiper
          autoplay
          horizontal={false}
          height={200}
          activeDotColor="#FF6347"
        >
          <View style={styles.slide}>
            <Image
              source={require("../assets/banners/banner_1.jpeg")}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={require("../assets/banners/banner_2.jpeg")}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={require("../assets/banners/banner_3.jpeg")}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </View>
        </Swiper>
      </View>

      <View style={{ flexDirection: "row", marginTop: 45 }}>
        <Title style={{ marginLeft: 130, marginBottom: 20 }}>
          Route No: {routeDetails.routeNo}
        </Title>
      </View>

      <Title style={{ marginLeft: 80, marginBottom: 20 }}>
        Starting Point: {routeDetails.startingPoint}
      </Title>
      <View style={{ width: "35%", marginLeft: 120, marginTop: 20 }}>
        <Button
          color="#694fad"
          title="Lets Go"
          height="100"
          borderRadius="10"
          onPress={() => startHandler()}
        />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sliderContainer: {
    height: 200,
    width: "90%",
    marginTop: 10,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 8,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  sliderImage: {
    height: "100%",
    width: "100%",
    alignSelf: "center",
    borderRadius: 8,
  },
});
