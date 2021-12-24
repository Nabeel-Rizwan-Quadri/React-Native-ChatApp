import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth"
import { getFirestore, setDoc, doc, addDoc, collection, query, getDocs, getDoc, where, orderBy, connectFirestoreEmulator } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBeTezlz0nDPYP_Zby-L-AhBOQ9SpedfRg",
  authDomain: "web-chat-a57c0.firebaseapp.com",
  projectId: "web-chat-a57c0",
  storageBucket: "web-chat-a57c0.appspot.com",
  messagingSenderId: "12743501453",
  appId: "1:12743501453:web:df3be35ca763cd0f2624c4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth()
const db = getFirestore();

async function registerUser(authData, password) {
  const { email, fullName, age, phoneNumber, photoURL } = authData
  const { user: { uid } } = await createUserWithEmailAndPassword(auth, email, password)

  await updateProfile(auth.currentUser, {
    displayName: fullName,
  })

  await setDoc(doc(db, "users", uid), {
    fullName, email, age, uid, phoneNumber
  })
}

async function loginUser({ email, password }) {
  const { user: { uid } } = await signInWithEmailAndPassword(auth, email, password)
}

async function logout() {
  try {
    await signOut(auth)
    alert("successfully logged out")
  }
  catch (e) {
    alert(e.message)
  }
}

async function getCurrentUsers(uid) {

  let dataCopyArray = []

  const q = query(collection(db, "users"))
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    let dataCopy = doc.data()
    if (dataCopy.uid == uid) {
      dataCopyArray.push({ ...dataCopy, id: doc.id })
    }

  });

  return dataCopyArray
}

async function getAllUsers(uid, phoneNumber) {
  // console.log("firebase currentUserId", uid)
  // console.log("firebase phoneNumber", phoneNumber)

  let dataCopyArray = []

  if (phoneNumber) {
    const q = query(collection(db, "users"), where('phoneNumber', '==', phoneNumber))
    const querySnapshot = await getDocs(q);
    // console.log("firebase querySnapshot", querySnapshot)

    querySnapshot.forEach((doc) => {
      let dataCopy = doc.data()
      if (doc.data().uid != uid) {
        dataCopyArray.push({ ...dataCopy, id: doc.id })
      }
    });
  }
  else {
    const q = query(collection(db, "users"))
    const querySnapshot = await getDocs(q);
    // console.log("firebase querySnapshot", querySnapshot)

    querySnapshot.forEach((doc) => {
      let dataCopy = doc.data()
      if (doc.data().uid != uid) {
        dataCopyArray.push({ ...dataCopy, id: doc.id })
      }
    });
  }

  return dataCopyArray
}

async function getAllActiveChats(currentUserId) {
  // console.log("firebase currentUserId", currentUserId)
  const colRef = collection(db, "ChatRooms")
  const q = query(colRef, orderBy('lastMessage.createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  console.log("querySnapshot", querySnapshot)

  let dataCopyArray = []

  querySnapshot.forEach((doc) => {
    let dataCopy = doc.data()

    if (doc.data().users[currentUserId]) {
      console.log("if chala")
      dataCopyArray.push({ ...dataCopy, id: doc.id })
    }
    else{
      console.log("no chats")
    }

  });
  console.log("dataCopyArray ", dataCopyArray)
  return dataCopyArray
}

async function newChatRoom(currentUser, selectedUser) {
  let selectedUserId = selectedUser.uid
  let currentUserId = currentUser.uid
  // console.log("newChatRoom", currentUser, selectedUser)

  const now = Date.now()
  

  try {
    const q = query(collection(db, "ChatRooms"), where(`users.${currentUserId}`, "==", true), where(`users.${selectedUserId}`, "==", true));
    const querySnapshot = await getDocs(q);
    let room = false
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      room = {}
      room = doc.data()
      room.roomId = doc.id

    });
    let time = Date().slice(0, 21)
    if (!room) {
      await addDoc(collection(db, "ChatRooms"), {
        users: {
          [selectedUserId]: true,
          [currentUserId]: true
        },
        createdAt: now,
        lastMessage: {
          message: "",
          createdAt: time
        },
        roomName: currentUser.fullName + " / " + selectedUser.fullName,
        usersId: [currentUserId, selectedUserId],
        sendersDetails: {
          [selectedUserId]: currentUser,
          [currentUserId]: selectedUser
        }
      })

      const q = query(collection(db, "ChatRooms"), where(`users.${currentUserId}`, "==", true), where(`users.${selectedUserId}`, "==", true));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        room = {}
        room = doc.data()
        room.roomId = doc.id
      });
      alert("Chat successfully created \n Happy chatting")
      return room
    }
    else {
      return room
    }
    // 
  }
  catch (error) {
    console.log(error)
  }
}

async function getRoomInfo(roomId) {

  const docRef = doc(db, "ChatRooms", roomId);
  const docSnap = await getDoc(docRef);
  // console.log("docSnap ", docSnap.data())
  return docSnap.data()
}

async function storeMessage(roomId, message) {
  let copyDataObject = []

  // console.log("Firebase storemessage", roomId, message)
  message.createdAt = Date.now()
  message.createdOn = Date().slice(0, 21)
  await addDoc(collection(db, "ChatRooms", roomId, "messages"), message)

  const docRef = doc(db, "ChatRooms", roomId);
  const docSnap = await getDoc(docRef);
  copyDataObject = docSnap.data()
  let lastMessage = {
    message: message.message,
    createdOn: message.createdOn,
    createdAt: message.createdAt
  }
  copyDataObject.lastMessage = lastMessage
  console.log("copyDataObject", copyDataObject)

  await setDoc(doc(db, "ChatRooms", roomId), copyDataObject)
}

async function getChat(currentUser, selectedUser) {
  try {
    let cUid = currentUser.uid
    let sUid = selectedUser.id

    let dataCopyArray = []

    const q = query(collection(db,), orderBy("messages.createdOn", "asc"))
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      let dataCopy = doc.data()
      dataCopyArray.push({ ...dataCopy, id: doc.id })
    });

    return dataCopyArray
  }
  catch (error) {
    let cUid = currentUser.uid
    let sUid = selectedUser.id

    let dataCopyArray = []

    const q = query(collection(db, sUid + cUid))
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      let dataCopy = doc.data()
      dataCopyArray.push({ ...dataCopy, id: doc.id })
    });

    return dataCopyArray
  }
}

async function getCurrentUserData(currentUserId) {

  const docRef = doc(db, "users", currentUserId);
  const docSnap = await getDoc(docRef);
  // console.log(docSnap.data())

  return docSnap.data()
} 

export {
  registerUser,
  loginUser,
  logout,
  newChatRoom,
  getAllUsers,
  getCurrentUsers,
  getAllActiveChats,
  getChat,
  storeMessage,
  getRoomInfo,
  getCurrentUserData
}
