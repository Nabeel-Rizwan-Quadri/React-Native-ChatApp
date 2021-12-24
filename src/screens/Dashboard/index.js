import React, { useEffect, useState } from 'react';
import {
  View, FlatList, Text,
  StyleSheet, Dimensions,
  ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { Divider, Button, Paragraph, Dialog, Portal, Searchbar, DataTable } from 'react-native-paper'
import { useDispatch, useSelector } from "react-redux";


import { getAllUsers, newChatRoom, getRoomInfo, getCurrentUserData } from '../../config/firebase';

function Dashboard({ navigation }) {

  const currentUsersData = useSelector(state => state.userReducer.user)

  const [userData, setUserData] = useState()
  const [curretnUserInfo, setCurretnUserInfo] = useState([])

  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = query => setSearchQuery(query);

  useEffect(async () => {
    // const result = await getAllUsers(currentUsersData.uid)
    // setUserData(result)

    const response = await getCurrentUserData(currentUsersData.uid)
    setCurretnUserInfo(response)
  }, [])

  const createNewChat = async (selectedUser, chatName) => {
    const result = await newChatRoom(curretnUserInfo, selectedUser)
    let roomId = result.roomId
    navigation.navigate('Chat', { roomId, name: `${chatName}`})
  }

  const submit = async () => {
    // console.log(searchQuery)
    const result = await getAllUsers(currentUsersData.uid, searchQuery)
    setUserData(result)
  }

  return (
    <View >
      <Searchbar
        placeholder="Search a contact by number"
        onChangeText={onChangeSearch}
        onIconPress={submit}
        value={searchQuery}
      />
      <DataTable>
        {
          userData ? userData.map((item) => {
            return <DataTable.Row><TouchableOpacity
              style={styles.button}
              onPress={() => createNewChat(item, item.fullName)}>

              <DataTable.Cell style={styles.left}> {item.fullName}</DataTable.Cell>

            </TouchableOpacity></DataTable.Row>
          })
          : <Text style={{fontsize: 100, margin: 10}}>No chats found</Text>
        }
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({

});

export default Dashboard