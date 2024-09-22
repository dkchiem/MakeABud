import { writable, type Writable } from 'svelte/store';

export const RTCPeerConnectionStore: Writable<RTCPeerConnection> = writable();

export function createRTCPeerConnection() {
	const servers = {
		iceServers: [
			{
				urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
			}
		],
		iceCandidatePoolSize: 10
	};

	return new RTCPeerConnection(servers);
}

export async function createRTCOffer(peerConnection: RTCPeerConnection) {
	peerConnection.onicecandidate = (event) => {
		if (event.candidate) {
			// Send to web socket: event.candidate.toJSON();
		}
	};

	const offerDescription = await peerConnection.createOffer();
	await peerConnection.setLocalDescription(offerDescription);

	return {
		sdp: offerDescription.sdp,
		type: offerDescription.type
	};
}
