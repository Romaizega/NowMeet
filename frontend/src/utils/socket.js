import { io } from "socket.io-client";

const raw = JSON.parse(localStorage.getItem("persist:auth"));
const token = JSON.parse(raw.accessToken);

const socket = io('/', {
  auth: {
    token,
  },
  autoConnect: false,
});

export default socket;
