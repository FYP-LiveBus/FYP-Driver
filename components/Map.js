import React, { useState, useEffect }  from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { StyleSheet, Dimensions, Button ,Text} from 'react-native'
import * as Location from 'expo-location';
import { currentWriteUserData, startWriteUserData, finalWriteUserData } from "../firebase";
import axios from 'axios';

const height = Dimensions.get('window').height;
const Map = ({user, routeDetails, navigation}) => {

  const [location, setLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  
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
        timeInterval: 5000
      }, (locs) => {
        setLocation(locs);
        console.log(locs);
        console.warn(locs)
        if(user._id)
          currentWriteUserData(user._id, locs)
      });

    })();   // async

  }, []);   // useEffect

  const submitHandler = () => {
    axios.post(`https://livebusapi.herokuapp.com/api/driver/trips`,{
      driverName: user.username,
      routeNo: routeDetails.routeNo,
      startingPoint: routeDetails.startingPoint,
      endingPoint: routeDetails.endingPoint,
    })
    .then(response=>{
      alert("Trip End Successfully");
      navigation.navigate('Home');
      console.log(response.data);
    })
    .catch(err=>alert(err))
  }


  return (
    <>
      <Button style={styles.button} title="Start" onPress={() => {console.warn("working");startWriteUserData(user._id, location)}} />
      <Button title="End" onPress={() => {finalWriteUserData(user._id, location); submitHandler()}} />
      
      <MapView
      style={styles.map}
      loadingEnabled={true}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      region={{
        latitude: location.coords != undefined ? location.coords.latitude : 0,
        longitude: location.coords != undefined ? location.coords.longitude : 0,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121
      }}
    >
      {/* <Marker 
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
      /> */}

    </MapView>
    
    </>
    )
}

const styles = StyleSheet.create({
  map: {
    height: '100%',
    zIndex: 10,
  },
  button:{
    height:'150px',
    backgroundColor:'red',
    zIndex:1000,
  },
  container: {
    flex: 1,
  }
})

export default Map;


// https://lucianasato.eti.br/react-native/build-a-react-native-app-using-expo-installation-navigation-tabs-google-maps-part-1