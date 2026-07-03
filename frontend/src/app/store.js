import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import eventReducer from "../features/events/eventSlice";
import profileReducer from "../features/profile/profileSlice"
import interestReducer from "../features/interest/interestSlice"
import notificationReducer from "../features/notifications/notificationsSlice"
import aiReducer from "../features/ai/aiSlice"
import messagesReducer from '../features/message/messageSlice'
import {persistStore, persistReducer} from "redux-persist"


const storage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
}

const authPersistConfg = {
  key: 'auth',
  storage,
}

const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfg, authReducer),
    event: eventReducer,
    profile: profileReducer,
    interest:interestReducer,
    notification: notificationReducer,
    ai: aiReducer,
    messages: messagesReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({serializableCheck: false})
});

export default store;
export const persistor = persistStore(store)
