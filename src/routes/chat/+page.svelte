<script lang="ts">
	import { env } from '$env/dynamic/public';
	import MessageBubble from '$lib/components/MessageBubble.svelte';
	import type { Message } from '$lib/types/Message';
	import { usernameStore } from '$lib/user';
	import io, { Socket } from 'socket.io-client';
	import { onMount } from 'svelte';

	let socket: Socket;
	let chat: HTMLDivElement;
	let messages: Message[] = [];
	let textfield: HTMLInputElement;
	let message = '';
	let username: string;
	let roomId = '';
	let showConnected = false;
	let partnerDisconnected = false;

	usernameStore.subscribe((value) => {
		username = value;
	});

	onMount(() => {
		if (!env.PUBLIC_URL) throw new Error('No public url provided!');

		socket = io(window.origin, {
			query: { username }
		});

		socket.on('connect_error', (err) => {
			// the reason of the error, for example "xhr poll error"
			console.log(err.message);

			// some additional description, for example the status code of the initial HTTP response
			// @ts-ignore
			console.log(err.description);

			// some additional context, for example the XMLHttpRequest object
			// @ts-ignore
			console.log(err.context);
		});

		socket.connect();
		console.log(socket, env.PUBLIC_URL);

		// TODO: Change username to socket id in case usernames are the same for chat left or right

		// socket.on('connected', (data) => {
		// 	username = data.id;
		// 	console.log('Connected with username:', username);
		// });
		socket.on('paired', (data) => {
			console.log('Paired with user:', data.partnerId, 'in room:', data.roomId);
			roomId = data.roomId;
			showConnected = true;
		});
		socket.on('message', (message: Message) => {
			console.log('Message received:', message);
			messages = [...messages, message];
			chat.scrollTop = chat.scrollHeight;
		});
		socket.on('partnerDisconnected', () => {
			partnerDisconnected = true;
		});

		return () => socket.disconnect();
	});

	function sendMessage(event: SubmitEvent) {
		if (message == '') return;
		socket.emit('message', {
			fromId: socket.id,
			fromUsername: username,
			message,
			roomId
		} as Message);
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
			<MessageBubble username={message.fromUsername} messageFromSelf={message.fromId === socket.id}
				>{message.message}</MessageBubble
			>
		{/each}
		{#if partnerDisconnected}
			<p>Partner disconnected from server ☹️</p>
		{/if}
	</div>

	<form class="bottom-bar" on:submit={sendMessage}>
		<input type="text" placeholder="Message" bind:value={message} autofocus />
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
