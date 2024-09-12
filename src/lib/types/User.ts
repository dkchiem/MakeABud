import type { Socket } from 'socket.io';

export interface User {
	username: string;
	socket: Socket;
	// pastUsers: string[];
}
