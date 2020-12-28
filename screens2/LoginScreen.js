import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
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
      .then((response)=>{
        let user = response.data;
        try {
          // await AsyncStorage.setItem('user',JSON.stringify(user))
          this.props.setLogin(true);
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
      <View style={styles.container}>
        <Text style={styles.logo}>Live Bus</Text>
        <View style={styles.inputView} >
          <TextInput  
            style={styles.inputText}
            placeholder="Username" 
            placeholderTextColor="#003f5c"
            onChangeText={text => this.setState({username:text})}/>
        </View>
        <View style={styles.inputView} >
          <TextInput  
            secureTextEntry
            style={styles.inputText}
            placeholder="Password" 
            placeholderTextColor="#003f5c"
            onChangeText={text => this.setState({password:text})}/>
        </View>
        <TouchableOpacity onPress={()=>this.loginHandler()} style={styles.loginBtn}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity>
          <Text style={styles.loginText}>Signup</Text>
        </TouchableOpacity> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#057057',
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
    borderRadius:20,
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
    color:"#000",
    fontSize:11
  },
  loginBtn:{
    width:"40%",
    backgroundColor:"#fb5b5a",
    borderRadius:25,
    height:45,
    alignItems:"center",
    justifyContent:"center",
    marginTop:20,
    marginBottom:10
  },
  loginText:{
    color:"white"
  }
});
