// import { getFirestore, onSnapshot, doc, collection, query, getDocs, where, orderBy } from "firebase/firestore";

function updateChats(dataCopyArray) {
  // const db = getFirestore();

  return async (dispatch) => {
    
      dispatch({
        type: 'UPDATE_ALLCHATS',
        data: dataCopyArray
      })
  }
}

export {
  updateChats
}
