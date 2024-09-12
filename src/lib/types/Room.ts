import type { Socket } from 'socket.io';

export interface Room {
	roomId: string;
	userSockets: Socket[];
}
