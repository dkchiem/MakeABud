<script lang="ts">
	// import { RTCPeerConnectionStore } from '$lib/webrtc';
	import { onMount } from 'svelte';

	let localStream: MediaStream;
	let remoteStream: MediaStream;
	let webcamVideo: HTMLVideoElement;
	let remoteVideo: HTMLVideoElement;
	let peerConnection: RTCPeerConnection;

	onMount(async () => {
		// RTCPeerConnectionStore.subscribe((value) => {
		// 	peerConnection = value;
		// });
		localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
		remoteStream = new MediaStream();

		// Push tracks from local stream to peer connection
		localStream.getTracks().forEach((track) => {
			peerConnection.addTrack(track, localStream);
		});

		// Pull tracks from remote stream, add to video stream
		peerConnection.ontrack = (event) => {
			event.streams[0].getTracks().forEach((track) => {
				remoteStream.addTrack(track);
			});
		};

		webcamVideo.srcObject = localStream;
		remoteVideo.srcObject = remoteStream;

		// const offerDescription = await peerConnection.createOffer();
		// await peerConnection.setLocalDescription(offerDescription);

		// const offer = {
		// 	sdp: offerDescription.sdp,
		// 	type: offerDescription.type
		// };
	});
</script>

<div>
	<h3>Local</h3>
	<video autoplay playsinline bind:this={webcamVideo}></video>
</div>
<div>
	<h3>Remote</h3>
	<video autoplay playsinline bind:this={remoteVideo}></video>
</div>
