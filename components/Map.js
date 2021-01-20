import React, { useState, useEffect } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import {
  currentWriteUserData,
  startWriteUserData,
  finalWriteUserData,
} from "../firebase";
import * as firebase from "firebase";
import "firebase/firestore";
import { Button } from "react-native-paper";
import axios from "axios";

// const height = Dimensions.get("window").height;
const Map = ({ user, routeDetails, busDetails, navigation }) => {
  const [location, setLocation] = useState({});

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("PERMSSION NOT GRANTED");
        seterror({ error: "Permission not Granted" });
      }
      // let location = await Location.getCurrentPositionAsync({});
      // setLocation({latitude: location.coords.latitude, longitude: location.coords.longitude});
      Location.watchPositionAsync(
        {
          // accuracy: Location.Accuracy.BestForNavigation,
          // distanceInterval: 1,
          timeInterval: 5000,
        },
        (locs) => {
          setLocation(locs);
          console.log(locs);
          console.warn(locs);
          if (user._id) currentWriteUserData(user._id, locs);
        }
      );
    })(); // async
  }, []); // useEffect

  const submitHandler = () => {
    axios
      .post(`https://livebusapi.herokuapp.com/api/driver/trips`, {
        driverName: user.username,
        routeNo: routeDetails.routeNo,
        busNo: routeDetails.busNo,
        startingPoint: routeDetails.startingPoint,
        endingPoint: routeDetails.endingPoint,
      })
      .then((response) => {
        alert("Trip End Successfully");
        _stopGetLocationAsync();
        resetSeats();
        navigation.navigate("Home");
        console.log(response.data);
      })
      .catch((err) => alert(err));
  };

  const resetSeats = async () => {
    let totalSeats = busDetails.seats;
    const no = await firebase
      .firestore()
      .collection("Bus")
      .doc(routeDetails.busNo)
      .update({ seats: +totalSeats });
  };

  const _stopGetLocationAsync = async () => {
    const location = await Location.watchPositionAsync();
    return location.remove();
  };

  return (
    <View>
      <MapView
        style={styles.map}
        loadingEnabled={true}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        region={{
          latitude: location.coords != undefined ? location.coords.latitude : 0,
          longitude:
            location.coords != undefined ? location.coords.longitude : 0,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      />

      <View style={styles.container}>
        <Button
          color={Platform.OS === "android" ? "#009688" : "#009688"}
          mode="contained"
          style={styles.btn}
          onPress={() => {
            console.warn("working");
            if (user._id) startWriteUserData(user._id, location);
          }}
        >
          <Text>Start</Text>
        </Button>

        <Button
          color={Platform.OS === "android" ? "#009688" : "#009688"}
          mode="contained"
          style={styles.btn}
          onPress={() => {
            if (user._id) finalWriteUserData(user._id, location);
            submitHandler();
          }}
        >
          <Text>End</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    height: "96%",
    width: "96%",
    alignContent: "center",
    alignSelf: "center",
    // zIndex: 10,
    marginTop: -20,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    // backgroundColor: "red",
  },
  btn: {
    height: 41,
    width: "41%",
    alignSelf: "center",
    margin: "4%",
    // marginTop: "2%",
  },
  // btnContainer: {
  //   margin: "0%",
  // },
});

export default Map;
