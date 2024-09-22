import { createRTCPeerConnection, RTCPeerConnectionStore } from '$lib/webrtc';

export const ssr = false;

export function load() {
	const peerConnection = createRTCPeerConnection();
	RTCPeerConnectionStore.set(peerConnection);

	return {
		peerConnection
	};
}
