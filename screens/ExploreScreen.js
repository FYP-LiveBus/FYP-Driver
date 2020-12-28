import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation'

import Map from '../components/Map'

const ExploreScreen = ({route, navigation}) => {
  const {user, routeDetails} = route.params
  console.log(user);
  console.log(routeDetails);
    return (
      <SafeAreaView forceInset={{ top: 'always' }}>
        <Map user={user} routeDetails={routeDetails} navigation={navigation} />
      </SafeAreaView>
    );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});
