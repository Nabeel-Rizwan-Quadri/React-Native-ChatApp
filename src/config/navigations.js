import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useDispatch, useSelector } from "react-redux";

import { onAuthStateChanged, getAuth } from 'firebase/auth'

import { updateUser } from "../store/actions/userActions";
import Logout from '../screens/Logout';
import {
  Login,
  Signup,
  Dashboard,
  AllChats,
  Chat,
  Profile
} from "../screens"

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  const auth = getAuth()
  const Dispatch = useDispatch()

  const usersData = useSelector(state => state.userReducer.user)
  // console.log("navigation", usersData)
  const [user, setUser] = useState()
  // console.log("uid", user)

  useEffect(() => {
    onAuthStateChanged(auth, userData => {
      Dispatch(updateUser(userData))
      setUser(usersData)
    })
  }, [usersData])
  // console.log("user --> ", user)

  return (
    <NavigationContainer>
      {
        user ? <MainStack />
          :
          <AuthStack />
      }
    </NavigationContainer>
  );
}

function MainStack() {
  return <Drawer.Navigator initialRouteName="Pickup" >
    <Drawer.Screen name="DashboardStack" component={DashboardStack} />
    <Drawer.Screen name="Profile" component={Profile} />
    <Drawer.Screen name="Logout" component={Logout} />
  </Drawer.Navigator>
}

function AuthStack() {
  return <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Signup" component={Signup} />
  </Stack.Navigator>
}

function DashboardStack() {
  return <Tab.Navigator screenOptions={{ headerShown: false }}>
  <Tab.Screen name="AllUsers" component={Dashboard2Stack} />
  <Tab.Screen name="ChatStack" component={ChatStack} />
</Tab.Navigator>
}

function Dashboard2Stack() {
  return <Stack.Navigator >
  <Stack.Screen name="Dashboard2" component={Dashboard} />
  <Stack.Screen name="Chat" component={Chat} />
</Stack.Navigator>
}

function ChatStack() {
  return <Stack.Navigator >
  <Stack.Screen name="AllChats" component={AllChats} />
  <Stack.Screen name="Chat" component={Chat} />
</Stack.Navigator>
}