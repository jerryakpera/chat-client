import { io } from "socket.io-client";

const conn = io.connect("http://localhost:3044/");

export default conn;
