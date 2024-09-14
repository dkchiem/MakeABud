<script lang="ts">
	import { onMount } from 'svelte';

	const servers = {
		iceServers: [
			{
				urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
			}
		],
		iceCandidatePoolSize: 10
	};

	let peerConnection: RTCPeerConnection;
	let localStream: MediaStream;
	let remoteStream: MediaStream;
	let webcamVideo: HTMLVideoElement;
	let remoteVideo: HTMLVideoElement;

	onMount(async () => {
		peerConnection = new RTCPeerConnection(servers);
		localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
		remoteStream = new MediaStream();

		localStream.getTracks().forEach((track) => {
			peerConnection.addTrack(track, localStream);
		});

		peerConnection.ontrack = (event) => {
			event.streams[0].getTracks().forEach((track) => {
				remoteStream.addTrack(track);
			});
		};

		webcamVideo.srcObject = localStream;
		remoteVideo.srcObject = remoteStream;

		const offerDescription = await peerConnection.createOffer();
		await peerConnection.setLocalDescription(offerDescription);

		const offer = {
			sdp: offerDescription.sdp,
			type: offerDescription.type
		};
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
