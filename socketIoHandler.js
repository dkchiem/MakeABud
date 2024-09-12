import { Server } from 'socket.io';

export default function injectSocketIO(server) {
	const io = new Server(server);

	io.engine.on('connection_error', (err) => {
		console.log(err.req); // the request object
		console.log(err.code); // the error code, for example 1
		console.log(err.message); // the error message, for example "Session ID unknown"
		console.log(err.context); // some additional error context
	});

	io.on('connection', async (socket) => {
		const username = socket.handshake.query.username;
		console.log(`User ${username} connected.`);

		addToWaitingRoom(username, socket);

		const users = getUserPair();
		if (users) {
			createRoom(users[0], users[1]);
		}

		// socket.on('joinWaitingRoom', () => {
		// 	getUserPair()

		// 		const roomId = `room-${user1.id}-${user2.id}`;

		// 		// Notify both users that they are paired
		// 		user1.emit('paired', { partnerId: user2.id, roomId: roomId });
		// 		user2.emit('paired', { partnerId: user1.id, roomId: roomId });

		// 		// Start a private room for the pair
		// 		user1.join(roomId);
		// 		user2.join(roomId);

		// 		rooms.push({ roomId, users: [user1, user2] });

		// });

		socket.on('message', (message) => {
			if (message.message == '') return;
			io.to(message.roomId).emit('message', message);
		});

		socket.on('disconnect', () => {
			removeFromWaitingRoom(socket);
			deleteRoomWithUser(socket);
		});
	});
}

const rooms = [];
let waitingRoom = [];

function addToWaitingRoom(username, userSocket) {
	waitingRoom.push({
		username,
		socket: userSocket
		// pastUsers: []
	});
	return waitingRoom;
}

function removeFromWaitingRoom(socket) {
	waitingRoom = waitingRoom.filter((u) => u.socket != socket);
}

function createRoom(user1, user2) {
	const roomId = `room-${user1.socket.id}-${user2.socket.id}`;
	// Notify both users that they are paired
	user1.socket.emit('paired', { partnerId: user2.socket.id, roomId: roomId });
	user2.socket.emit('paired', { partnerId: user1.socket.id, roomId: roomId });

	// Start a private room for the pair
	user1.socket.join(roomId);
	user2.socket.join(roomId);
	rooms.push({ roomId, userSockets: [user1.socket, user2.socket] });

	console.log(`Room ${roomId} has been created with ${user1.username} and ${user2.username}`);
}

function deleteRoomWithUser(socket) {
	rooms.forEach((room) => {
		if (room.userSockets.includes(socket)) {
			room.userSockets.forEach((user) => {
				user.leave(room.roomId);
				user.emit('partnerDisconnected');
			});
			rooms.splice(rooms.indexOf(room), 1);
		}
	});
}

function getUserPair() {
	if (waitingRoom.length >= 2) {
		const user1 = waitingRoom.shift();
		const user2 = waitingRoom.shift();
		if (!user1 || !user2) throw new Error('A user in the waiting list is undefined.');

		return [user1, user2];
	}
}
