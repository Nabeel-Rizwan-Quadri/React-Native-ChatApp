function allChatsReducer(state = {}, action) {
    // console.log("chat reducer: ", action.data)
    switch (action.type) {
        case 'UPDATE_ALLCHATS': {
            return { ...state, allChats: action.data }
        }
        default: {
            return state
        }
    }
}

export default allChatsReducer