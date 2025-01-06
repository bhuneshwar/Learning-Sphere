import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:5000'); // Adjust the URL as needed

export default socket;