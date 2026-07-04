import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  notifications: [],

}

const notifSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setAddNotification: (state, action) =>{
      state.notifications.push(action.payload)
    },
    setRemoveNotification: (state, action) => {
      state.notifications = state.notifications.filter((notif) => notif.id !== action.payload)
    },
    setClearNotification: (state) => {
      state.notifications = []
    }
  },
})


export default notifSlice.reducer
export const {setAddNotification, setClearNotification, setRemoveNotification} = notifSlice.actions