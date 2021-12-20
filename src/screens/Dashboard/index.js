import React, { useEffect, useState } from 'react';
import {
  View, FlatList, Text,
  StyleSheet, Dimensions,
  ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { Divider, Button, Paragraph, Dialog, Portal, Provider, DataTable } from 'react-native-paper'
import { useDispatch, useSelector } from "react-redux";


import { getAllUsers, newChatRoom, getRoomInfo } from '../../config/firebase';

function Dashboard({ navigation }) {

  const currentUsersData = useSelector(state => state.userReducer.user)

  const [userData, setUserData] = useState([])

  useEffect(async () => {
    const result = await getAllUsers(currentUsersData.uid)
    setUserData(result)
  }, [])

  const createNewChat = async (selectedUser) => {
    const result = await newChatRoom(currentUsersData.uid, selectedUser.uid)
    // console.log("dashboard room id", result.roomId)
    let roomId = result.roomId
    navigation.navigate('Chat', { roomId })

  }
  
  return (
    <View >
      <Text>ALL REGISTERED USERS</Text>
      <DataTable>
        {
          userData.map((item) => {
            return <DataTable.Row><TouchableOpacity
              style={styles.button}
              onPress={() => createNewChat(item)}>

              <DataTable.Cell style={styles.left}> {item.fullName}</DataTable.Cell>

            </TouchableOpacity></DataTable.Row>
          })
        }
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({

});

export default Dashboard