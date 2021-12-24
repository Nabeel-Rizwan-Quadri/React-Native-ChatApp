import React, { useEffect, useState } from 'react';
import {
  View, TextInput, Text,
  StyleSheet, Dimensions,
  ScrollView, TouchableOpacity
} from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { Button } from 'react-native-paper'
import { getFirestore, onSnapshot, setDoc, doc, addDoc, collection, query, getDocs, where, orderBy } from "firebase/firestore";

import { getRoomInfo, storeMessage } from '../../config/firebase';
import { updateChats } from '../../store/actions/allChatsActions';
// import Footer from '../../components/Footer';

function Chat({ route }) {
  const db = getFirestore();
  const dispatch = useDispatch()

  const roomId = route.params.roomId

  const currentUser = useSelector(state => state.userReducer.user)

  // const allMessages = useSelector(state => state.allChatsReducer.allChats)
  // console.log("Chats allMessages ", allMessages)

  let createdAt = Date.now()
  const [messageInfo, setMessageInfo] = useState({
    message: "",
    images: [],
    uid: currentUser.uid,
    createdAt: createdAt
  })

  const [refresh, setRefresh] = useState(false)

  // const [roomInfo, setRoomInfo] = useState()

  const [chatData, setChatData] = useState([])


  useEffect(async () => {
    //Calling all chats from redux
    try {
      const q = query(collection(db, "ChatRooms", roomId, "messages"), orderBy('createdAt', 'asc'));

      onSnapshot(q, (querySnapshot) => {
        const copyDataArray = [];
        querySnapshot.forEach((doc) => {
          copyDataArray.push(doc.data());
        });
        console.log("copyDataArray: ", copyDataArray);
        setChatData(copyDataArray)
        dispatch(updateChats(copyDataArray))
      });
    }
    catch (error) {
      console.log("Chat realtime error", error)
    }

  }, [])

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
    <View style={{ flex: 1, flexDirection: 'column'}}>

      <ScrollView style={styles.scrollView}>
        {
          chatData.map((item) => {
            if (currentUser.uid == item.uid) {
              return <Text style={styles.send}> {item.message} {"\n"}
                <Text style={styles.time}>
                  {Date(item.createdOn).slice(0, 21)}
                </Text>
              </Text>

            }
            else {
              return <Text style={styles.recive}> {item.message} {"\n"}
                <Text style={styles.time}>
                  {Date(item.createdOn).slice(0, 21)}
                </Text>
              </Text>
            }
          })
        }
        
      </ScrollView>

      <View style={styles.footer}>
        <TextInput style={styles.input} placeholder="  Message" type='string' onChangeText={(text) => onChangeValues("message", text)}/>
        <Button style={styles.button} mode="contained" onPress={submit} >></Button>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
    flex: 1
  },
  footer: {
    flex: 0.09,
    flexDirection: "row",
    backgroundColor: "ghostwhite"
  },
  input: {
    height: "100%",
    flex: 250,
  },
  button: {
    flex: 1,
  },
  send: {
    width: '49%',
    backgroundColor: 'lightgreen',
    fontSize: 20,
    textAlign: 'right',
    padding: 10,
    margin: 3,
    marginLeft: "50%",
    borderRadius: 25,
    borderBottomRightRadius: 0,
  },
  recive: {
    width: '50%',
    backgroundColor: 'skyblue',
    fontSize: 20,
    textAlign: 'left',
    padding: 10,
    margin: 3,
    borderRadius: 25,
    borderBottomLeftRadius: 0,
  },
  time: {
    color: "grey",
    fontSize: 10,
    textAlign: 'left',
  },
  text: {
    fontSize: 42,
    flex: 1
  },
});


export default Chat