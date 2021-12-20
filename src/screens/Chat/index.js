import React, { useEffect, useState } from 'react';
import {
  View, FlatList, Text,
  StyleSheet, Dimensions,
  ScrollView, TouchableOpacity
} from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from 'react-native-paper';
import { TextInput, Button } from 'react-native-paper'
import { getFirestore, setDoc, doc, addDoc, collection, query, getDocs, where, orderBy } from "firebase/firestore";

import { getRoomInfo, storeMessage } from '../../config/firebase';
import { updateChats } from '../../store/actions/allChatsActions';
import Footer from '../../components/Footer';

function Chat({ route }) {
  const db = getFirestore();
  const dispatch = useDispatch()

  const roomId = route.params.roomId

  const currentUser = useSelector(state => state.userReducer.user)

  const allMessages = useSelector(state => state.allChatsReducer.allChats)
  console.log("Chats allMessages ", allMessages)

  let createdAt = Date.now()
  const [messageInfo, setMessageInfo] = useState({
    message: "",
    images: [],
    uid: currentUser.uid,
    createdAt: createdAt
  })

  const [refresh, setRefresh] = useState(false)

  // const [roomInfo, setRoomInfo] = useState()

  // const [chatData, setChatData] = useState([])


  useEffect(async () => {

    // const result = await getRoomInfo(roomId)
    // setRoomInfo(result)

    //Calling all chats from redux

    dispatch(updateChats(roomId))


  }, [refresh])

  const onChangeValues = (key, text) => {
    // console.log(text)
    setMessageInfo({ ...messageInfo, [key]: text })
    // console.log("On Change: ", messageInfo)
  }

  const submit = async () => {
    // setMessageInfo({ ...messageInfo, userName: user.fullName })
    console.log("Submit: ", messageInfo)
    await storeMessage(roomId, messageInfo)
    setRefresh(true)
  }

  return (
    <View >
      <DataTable style={styles.DataTable}>
        {
          allMessages.map((item) => {
            if (currentUser.uid == item.uid) {
              return <DataTable.Row>
                <DataTable.Cell style={styles.left}> {item.message}</DataTable.Cell>
              </DataTable.Row>
            }
            else {
              return <DataTable.Row>
                <DataTable.Cell style={styles.right}> {item.message}</DataTable.Cell>
              </DataTable.Row>
            }
          })
        }
      </DataTable>
      <View style={styles.footer}>
        <View className='bar'>
          <TextInput style={{ width: '100%' }} label="message" type='string' onChangeText={(text) => onChangeValues("message", text)} ></TextInput>
          <Button style={{ width: '100%' }} mode="contained" onPress={submit} >Sub</Button>
        </View>
        {/* <Footer /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    height: '80%',
    marginHorizontal: 20,
  },
  DataTable: {
    height: '80%'
  },
  left: {
    width: '100%',
    backgroundColor: 'green',
    fontSize: 30,
    textAlign: 'right'
  },
  right: {
    width: '100%',
    backgroundColor: 'aqua',
    fontSize: 30,
    textAlign: 'left'
  },
  footer: {
    width: '100%',
    position: 'absolute'
  }
});


export default Chat