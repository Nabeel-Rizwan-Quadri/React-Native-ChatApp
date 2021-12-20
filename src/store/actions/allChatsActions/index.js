import { getFirestore, onSnapshot, doc, collection, query, getDocs, where, orderBy } from "firebase/firestore";


function updateChats(roomId) {
  const db = getFirestore();

  return async (dispatch) => {
    try {
      const q = query(collection(db, "ChatRooms", roomId, "messages"), orderBy('createdAt','asc'));
      const querySnapshot = await getDocs(q);

      let dataCopyArray = []

      querySnapshot.forEach((doc) => {
        let dataCopy = doc.data()
        dataCopyArray.push({ ...dataCopy, id: doc.id })
      });

      console.log(dataCopyArray)

      dispatch({
        type: 'UPDATE_ALLCHATS',
        data: dataCopyArray
      })
    }
    catch (error) {
      console.log("redux error", error)
    }
  }
}

export {
  updateChats
}
