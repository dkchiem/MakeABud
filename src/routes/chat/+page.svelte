<script lang="ts">
	import MessageBubble from '$lib/components/MessageBubble.svelte';
	import type { Message } from '$lib/types/Message';
	import { usernameStore } from '$lib/user';
	import io, { Socket } from 'socket.io-client';
	import { onMount } from 'svelte';
	import type { Action } from 'svelte/action';

	let socket: Socket;
	let messages: Message[] = [];
	let message = '';
	let username: string;
	let roomId = '';
	let showConnected = false;
	let partnerDisconnected = false;

	usernameStore.subscribe((value) => {
		username = value;
	});

	onMount(() => {
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
			// console.log('Message received:', message);
			messages = [...messages, message];
			// console.log(chat.scrollHeight);
			// queueMicrotask(() => {
			// 	console.log(
			// 		chat.scrollHeight,
			// 		chat.clientHeight,
			// 		chat.getBoundingClientRect(),
			// 		chat.getClientRects()
			// 	);
			// 	chat.scroll({ top: chat.scrollHeight, behavior: 'smooth' });
			// });
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
		message = '';
	}

	const scrollToBottom: Action = (node) => {
		const observer = new MutationObserver(() => {
			node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
		});
		observer.observe(node, { childList: true });
		return {
			destroy() {
				observer.disconnect();
			}
		};
	};
</script>

<div class="container">
	<div class="top-bar">
		<button on:click={() => location.reload()}>Skip</button>
		<a href="/" class="exit"><button>Exit</button></a>
		<a href="/call" class="call"><button>Video Chat</button></a>
	</div>
	<div class="chat" use:scrollToBottom>
		<div class="chat-top-bar">
			<div class="text-animation">
			<div class="info">
				<span>Your username is {username}.</span>
				{#if !showConnected}
					<span>Finding a room, please wait...</span>
				{:else}
					<span>Connection successful! Start chatting now...</span>
				{/if}
			</div>
			</div>
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
		<!-- svelte-ignore a11y-autofocus -->
		<input type="text" placeholder="Message" bind:value={message} autofocus />
		<button>Send</button>
	</form>
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		height: 100%;
		.top-bar{
			display: flex;
			gap: 20px;
			align-items: center;
			justify-content: center;
			button{
				display: flex;
				justify-content: center;
			}
			a {
				text-decoration: none;
			}
		}
		.chat {
			flex: 1;
			overflow-y: scroll;
			display: flex;
			flex-direction: column;
			padding: 20px;
			.chat-top-bar {
				display: flex;
				justify-content: space-around;
				margin-bottom: 20px;
			}
			.info {
				display: flex;
				flex-direction: column;
				text-align: left;
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
				min-width: 0;
			}
		}
	}
</style>
