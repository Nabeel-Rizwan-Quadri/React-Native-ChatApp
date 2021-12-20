import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth"
import { getFirestore, setDoc, doc, addDoc, collection, query, getDocs, getDoc, where, orderBy } from "firebase/firestore";


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

async function getAllUsers(uid) {
  console.log("firebase currentUserId", uid)

  let dataCopyArray = []

  const q = query(collection(db, "users"), where('uid', '!=', uid))
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    let dataCopy = doc.data()
    dataCopyArray.push({ ...dataCopy, id: doc.id })
  });

  return dataCopyArray
}

async function getAllActiveChats(currentUserId) {
  // console.log("firebase currentUserId", currentUserId)

  const q = query(collection(db, "ChatRooms"), where(`users.${currentUserId}`, "==", true));
  const querySnapshot = await getDocs(q);

  let dataCopyArray = []

  querySnapshot.forEach((doc) => {
    let dataCopy = doc.data()
    dataCopyArray.push({ ...dataCopy, id: doc.id })
  });

  return dataCopyArray
}

async function newChatRoom(currentUserId, selectedUserId) {
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

    if (!room) {
      await addDoc(collection(db, "ChatRooms"), {
        users: {
          [selectedUserId]: true,
          [currentUserId]: true
        },
        createdAt: now,
        lastMessage: {}
      })
      const q = query(collection(db, "ChatRooms"), where(`users.${currentUserId}`, "==", true), where(`users.${selectedUserId}`, "==", true));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        room = {}
        room = doc.data()
        room.roomId = doc.id
      });
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
  console.log("Firebase storemessage", roomId, message)
  message.createdAt = Date.now()
  await addDoc(collection(db, "ChatRooms", roomId, "messages"), message)
}

async function getChat(currentUser, selectedUser) {
  try {
    let cUid = currentUser.uid
    let sUid = selectedUser.id

    let dataCopyArray = []

    const q = query(collection(db, ), orderBy("messages.createdOn", "asc"))
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
  getRoomInfo
}
