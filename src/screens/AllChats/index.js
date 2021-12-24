import React, { useEffect, useState } from 'react';
import {
  View, FlatList, Text,
  StyleSheet, Dimensions,
  ScrollView, TouchableOpacity
} from 'react-native';
import { DataTable } from 'react-native-paper'
import { useSelector } from "react-redux";
import { getFirestore } from "firebase/firestore";

import { getAllActiveChats } from '../../config/firebase';
// import { updateSelectedChat } from '../../store/actions/userActions';

function AllChats({ navigation }) {
  const db = getFirestore();

  // const Dispatch = useDispatch()

  // const { allChats } = useSelector(state => state.allChatsReducer)

  const currentUsersData = useSelector(state => state.userReducer.user)

  const allChats = useSelector(state => state.allChatsReducer)
  // console.log("allChats state", allChats)

  const [activeChats, setAllActiveChats] = useState([])
  // console.log("activeChats", activeChats)

  useEffect(async () => {

    // const q = query(collection(db, "ChatRooms"), where(`users.${currentUsersData.uid}`, "==", true));

    // onSnapshot(q, (querySnapshot) => {
    //   const copyDataArray = [];
    //   querySnapshot.forEach((doc) => {
    //     copyDataArray.push(doc.data());
    //   });
    //   console.log("copyDataArray: ", copyDataArray);
    //   setAllActiveChats(copyDataArray)
    // });

    const result = await getAllActiveChats(currentUsersData.uid)
    // console.log("result", result)
    setAllActiveChats(result)

  }, [allChats])

  const openChat = (roomId, chatName) => {
    navigation.navigate('Chat', { roomId, name: `${chatName}`})
  }

  return (
    <View>
      <DataTable>
        {
          activeChats.map((item) => {
            // console.log(item.sendersDetails)
            let chatName = item.sendersDetails[currentUsersData.uid].fullName
            // let chatName = " a"
            return <DataTable.Row style={styles.row}><TouchableOpacity
              style={styles.button}
              onPress={() => openChat(item.id, chatName)}>

              {/* <Text style={styles.profilePic}>u{"\n"}</Text> */}

              <DataTable.Cell style={{fontsize: 30}}> {chatName} {"\t"}{"\t"}
              <Text style={styles.time}>{item.lastMessage.createdOn || ""}</Text>
              </DataTable.Cell>

              <Text style={styles.time}>{item.lastMessage.message}</Text>

            </TouchableOpacity></DataTable.Row>
          })
        }
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  chat: {
    flex: 1,
    width: '100%',
  },
  row: {
  },
  time: {
    color: "grey"
  },
  // profilePic: {
  //   backgroundColor: "black",
  //   color: "white",
  //   fontSize: 50,
  //   borderRadius: "100%",
  //   width: "10%",
  // }
});

export default AllChats