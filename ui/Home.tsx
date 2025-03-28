import { View, Text,Button,Alert } from 'react-native'
import React,{useContext} from 'react'
import { Auth } from 'firebase/auth'
import {logoutUser} from '../services/authService'
import Setting from './Setting'
import { colors } from '../config/theme'
import { ThemeContext } from '../constants/ThemeContext'

const Home = ({user}) => {
  const {theme} = useContext(ThemeContext);
  const activateColors = colors[theme.mode];


const handelSignOut= async () => {
  try{
    logoutUser();
    Alert.alert("Sign Out", `{user.email} have been signed out successfully.`);
  }catch(err: any){
    console.log(err.message);
  
  }
}

  return (
    <View style={{flex:1}}>
      <Text>Home</Text>
      <Button title="Sign Out" onPress={handelSignOut} />
      <Setting/>
    </View>
  )
}

export default Home