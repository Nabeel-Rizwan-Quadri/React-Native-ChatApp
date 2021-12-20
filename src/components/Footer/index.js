// import React, { useEffect, useState } from 'react';
// import {
//     View, FlatList, Text,
//     StyleSheet, Dimensions,
//     ScrollView, TouchableOpacity
// } from 'react-native';
// import { TextInput, Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper'
// import { useDispatch, useSelector } from "react-redux";

// import { storeMessage } from "../../config/firebase";

// function Footer() {

//     const selectedChat = useSelector(state => state.userReducer.selectedChat)
//     // console.log(selectedChat)
//     const currentUser = useSelector(state => state.userReducer.user)
//     // console.log(currentUser)

//     const user = useSelector(state => state.userReducer.user)

//     let createdAt = Date.now()
//     const [messageInfo, setMessageInfo] = useState({
//         message: "",
//         images: [],
//         uid: user.uid,
//         createdOn: createdAt
//     })

//     const onChangeValues = (key, text) => {
//         console.log(text)
//         setMessageInfo({ ...messageInfo, [key]: text })
//         console.log("On Change: ", messageInfo)
//     }

//     //   const onChangeValues = (key, text) => {
//     //     console.log(text)
//     //     setAuthData({ ...authData, [key]: text })
//     //     console.log("On Change: ", authData)
//     //   }

//     const submit = async () => {
//         // setMessageInfo({ ...messageInfo, userName: user.fullName })
//         console.log("Submit: ", messageInfo)
//         await storeMessage(currentUser, selectedChat, messageInfo)
//     }

//     return <View>
//         <View className="footer">
//             <View className='bar'>
//                 <TextInput style={{ width: '100%' }} label="message" type='string' onChangeText={(text) => onChangeValues("message", text)} ></TextInput>
//                 <Button style={{ width: '100%' }}  mode="contained" onPress={submit} >Sub</Button>
//             </View>
//         </View>
//     </View>
// }


// const styles = StyleSheet.create({
//     footer: {
//       width: '100%',
//       height: '80%',
//       marginHorizontal: 20,
//     },
//     bar: {
//       height: 80
//     },
//     left: {
//       width: '100%',
//       backgroundColor: 'green',
//       fontSize: 30,
//       textAlign: 'left'
//     },
//     right: {
//       width: '100%',
//       backgroundColor: 'blue',
//       fontSize: 30,
//       textAlign: 'right'
//     },
//     footer: {
//       position: 'fixed'
//     }
//   });

// export default Footer;
