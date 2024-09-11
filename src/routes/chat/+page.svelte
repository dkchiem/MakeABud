<script lang="ts">
	import { onMount } from 'svelte';
	import ioClient, { Socket } from 'socket.io-client';

	interface Message {
		from: string;
		message: string;
		roomId: string;
		// date: string;
	}

	let io: Socket;
	let chat: HTMLDivElement;
	let messages: Message[] = [];
	let textfield: HTMLInputElement;
	let message = '';
	let username = '';
	let roomId = '';
	let showConnected = false;
	let partnerDisconnected = false;

	onMount(() => {
		io = ioClient('http://localhost:3000');

		io.emit('joinWaitingRoom');
		io.on('connected', (data) => {
			username = data.id;
			console.log('Connected with username:', username);
		});
		io.on('paired', (data) => {
			console.log('Paired with user:', data.partnerId, 'in room:', data.roomId);
			roomId = data.roomId;
			showConnected = true;
		});
		io.on('message', (message) => {
			console.log('Message received:', message);
			messages = [...messages, message];
			chat.scrollTop = chat.scrollHeight;
		});
		io.on('partnerDisconnected', () => {
			partnerDisconnected = true;
		});

		return () => io.disconnect()
	});

	function sendMessage(event: SubmitEvent) {
		if (message == "") return;
		io.emit('message', { from: username, message, roomId });
		(event.target as HTMLFormElement).reset();
	}
</script>

<div class="container">
	<div class="chat" bind:this={chat}>
		<div class="chat-top-bar">
			<div class="info">
				<span>Your username is {username}.</span>
				{#if !showConnected}
					<span>Finding a room, please wait...</span>
				{:else}
					<span>Connection successful! Start chatting now...</span>
				{/if}
			</div>
			<a href="/" class="exit"><button>Exit</button></a>
		</div>
		

		{#each messages as message}
			<div
				class="bubble"
				class:right={message.from === username}
				class:left={message.from !== username}
			>
				{message.message}
			</div>
		{/each}
		{#if partnerDisconnected}
			<p>Partner disconnected from server ☹️</p>
		{/if}
	</div>

	<form class="bottom-bar" on:submit={sendMessage}>
		<input type="text" placeholder="Message" bind:value={message} autofocus/>
		<button>Send</button>
		<button on:click={() => location.reload()}>Skip</button>
	</form>
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		height: 100%;

		.chat {
			flex: 1;
			overflow-y: auto;
			display: flex;
			flex-direction: column;
			padding: 20px;
			.chat-top-bar {
				display: flex;
				justify-content: space-between;
				margin-bottom: 20px;
			}
			.info {
				display: flex;
				flex-direction: column;
				button {
					margin-left: auto;
				}
			}
			.bubble {
				padding: 10px 20px;
				border: 2px black solid;
				color: black;
				margin-top: 5px;
				&.left {
					align-self: flex-start;
					border-radius: 15px 15px 15px 0;
				}
				&.right {
					align-self: flex-end;
					border-radius: 15px 15px 0 15px;
				}
			}
		}
		.bottom-bar {
			border-top: 1px black solid;
			background-color: #f0f0f0;
			padding: 10px;
			display: flex;
			gap: 10px;
			input {
				flex: 1;
				padding: 20px 30px;
				outline: none;
				border-radius: 50px;
				border: 1px solid black;
				font-family: 'Reddit Mono', monospace;
				font-size: 1rem;
			}
		}
	}
</style>
