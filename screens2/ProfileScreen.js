import React, { Component } from 'react';
import { StyleSheet, SafeAreaView,Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class LoginScreen extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      username:"",
      password:""
    }
  }

  loginHandler = () =>{
    const URL = "https://livebusapi.herokuapp.com/api/users/login-driver";
    axios.post(URL, {username: this.state.username, password: this.state.password})
      .then(async(response)=>{
        let user = response.data;
        try {
          // await AsyncStorage.setItem('user',JSON.stringify(user))
          setLogin(true);
        } catch (e) {
            alert(e)
          // saving error
        }
      })
      .catch(error => {
        alert("Error occure duning authentication!")
        console.log(error);
      })
  }

  
  render(){


    return (
      <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.logo}>Profile</Text>
        <View style={styles.inputView} >
          <TextInput  
            style={styles.inputText}
            placeholderTextColor="#003f5c"
            value={'driver'}
            editable={false}
            />
        </View>
        <View style={styles.inputView} >
          <TextInput  
            
            style={styles.inputText}
            placeholder="Password" 
            placeholderTextColor="#003f5c"
            value={'driver'}
            editable={false}/>
        </View>
        <View style={styles.inputView} >
          <TextInput  
            
            style={styles.inputText}
            placeholder="Password" 
            placeholderTextColor="#003f5c"
            value={'driver'}
            editable={false}/>
        </View>
        <View style={styles.inputView} >
          <TextInput  
            
            style={styles.inputText}
            placeholder="Password" 
            placeholderTextColor="#003f5c"
            value={'driver'}
            editable={false}/>
        </View>
        <View style={styles.inputView} >
          <TextInput  
            
            style={styles.inputText}
            placeholder="Password" 
            placeholderTextColor="#003f5c"
            value={'driver'}
            editable={false}/>
        </View>
        <View style={styles.inputView} >
          <TextInput  
            
            style={styles.inputText}
            placeholder="Password" 
            placeholderTextColor="#003f5c"
            value={'driver'}
            editable={false}/>
        </View>
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>loginHandler()} style={styles.loginBtn}>
          <Text style={styles.loginText}>Logout</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity>
          <Text style={styles.loginText}>Signup</Text>
        </TouchableOpacity> */}
      </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:40
  },
  inputView:{
    width:"80%",
    backgroundColor:"#465881",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"white"
  },
  forgot:{
    color:"white",
    fontSize:11
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#fb5b5a",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  loginText:{
    color:"white"
  }
});
