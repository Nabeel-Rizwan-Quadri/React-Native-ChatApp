import React, { useEffect, useState } from 'react';
import {
  View, FlatList, Text,
  StyleSheet, Dimensions,
  ScrollView, TouchableOpacity
} from 'react-native';
import { Divider, Button, DataTable } from 'react-native-paper'
import { useDispatch, useSelector } from "react-redux";

import { getAllActiveChats } from '../../config/firebase';
import { updateSelectedChat } from '../../store/actions/userActions';

function AllChats({ navigation }) {
  const Dispatch = useDispatch()
  const { allChats } = useSelector(state => state.allChatsReducer)
  const currentUsersData = useSelector(state => state.userReducer.user)

  const [activeChats, setAllActiveChats] = useState([])

  useEffect(async () => {
    const result = await getAllActiveChats(currentUsersData.uid)
    console.log("result", result)
    setAllActiveChats(result)
  }, [])

  const openChat = (selectedChat) => {
    // Dispatch(updateSelectedChat(selectedChat))
    // navigation.navigate('Chat', { selectedChat })
  }

  return (
    <View>
      <Text>ALL ACTIVE Chats</Text>
      <DataTable>
        {/* {
          allChats.map((item) => {

          console.log(item.)

            return <DataTable.Row><TouchableOpacity
              style={styles.button}
              onPress={() => openChat(item)}>

              <DataTable.Cell style={styles.left}> {item.users}</DataTable.Cell>

            </TouchableOpacity></DataTable.Row>
          })
        } */}
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  chat: {
    flex: 1,
    width: '100%',
    height: '50%',
    fontSize: 30,
    justifyContent: 'center'
  }
});

export default AllChats