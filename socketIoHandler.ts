import http from 'http';
import { Server, Socket } from 'socket.io';

export default function injectSocketIO(server: http.Server) {
	const io = new Server(server);

	let waitingRoom: Socket[] = [];
	const rooms: Room[] = [];

	interface Room {
		roomId: string;
		users: Socket[];
	}

	io.on('connection', async (socket) => {
		// Send the connected user their ID
		socket.emit('connected', { id: socket.id });

		// Add the user to the waiting room
		socket.on('joinWaitingRoom', () => {
			waitingRoom.push(socket);
			// console.log(waitingRoom)
			if (waitingRoom.length >= 2) {
				const user1 = waitingRoom.shift(); // Remove the first user
				const user2 = waitingRoom.shift(); // Remove the second user

				if (!user1 || !user2) {
					return;
				}

				const roomId = `room-${user1.id}-${user2.id}`;

				// Notify both users that they are paired
				user1.emit('paired', { partnerId: user2.id, roomId: roomId });
				user2.emit('paired', { partnerId: user1.id, roomId: roomId });

				// Start a private room for the pair
				user1.join(roomId);
				user2.join(roomId);

				rooms.push({ roomId, users: [user1, user2] });
			}
		});

		socket.on('disconnect', () => {
			waitingRoom = waitingRoom.filter((user) => user != socket)
			// If disconnected user is in a room, delete the room
			rooms.forEach((room) => {
				if (room.users.includes(socket)) {
					room.users.forEach((user) => {
						user.leave(room.roomId);
						user.emit('partnerDisconnected');
					});
					rooms.splice(rooms.indexOf(room), 1);
				}
			});
		});

		socket.on('message', (message) => {
			if (message == "") return;
			io.to(message.roomId).emit('message', {
				from: message.from,
				message: message.message
				// time: new Date().toLocaleString()
			});
		});

		// const room = `Room ${Math.round(Math.random() * 999999)}`;
		// socket.join(room);

		// const username = `User ${Math.round(Math.random() * 999999)}`;
		// socket.emit('name', username);
	});

	console.log('SocketIO injected');
}
