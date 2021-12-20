function userReducer(state = {}, action) {
    switch (action.type) {
        case 'UPDATE_USER': {
            return { ...state, user: action.data }
        }
        case 'UPDATE_SELECTED_CHAT': {
            return { ...state, selectedChat: action.data }
        }
        case 'DELETE_USER': {
            return { ...state, user: NULL }
        }
        default: {
            return state
        }
    }
}

export default userReducer