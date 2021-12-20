import { getAllDrivers } from "../../../config/firebase"

function updateUser(user){
    return {
        type: "UPDATE_USER",
        data: user
    }
}

function updateSelectedChat(selectedChat){
    return {
        type: "UPDATE_SELECTED_CHAT",
        data: selectedChat
    }
}

function deleteUser(user){
    return {
        type: "DELETE_USER",
        data: user
    }
}

export {
    updateUser,
    deleteUser,
    updateSelectedChat
}