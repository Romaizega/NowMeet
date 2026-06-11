import {io} from "socket.io-client"

const raw = JSON.parse(localStorage.getItem('persist:auth'))
const token = JSON.parse(raw.accessToken) 

const socket = io(import.meta.env.VITE_SERVER_URL, {
  auth: {
    token
  },
  autoConnect: false
}) 


export default socket