<script lang="ts">
	import { io } from '$lib/webSocketConnection';
	import { onMount } from 'svelte';

	interface Message {
		from: string;
		message: string;
		roomId: string;
		// date: string;
	}

	let chat: HTMLDivElement;
	let messages: Message[] = [];
	let textfield = '';
	let username = '';
	let roomId = '';
	let showConnected = false;
	let partnerDisconnected = false;

	onMount(() => {
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
	});

	function sendMessage(event: SubmitEvent) {
		io.emit('message', { from: username, message: textfield, roomId });
		(event.target as HTMLFormElement).reset();
	}
</script>

<div class="container">
	<div class="chat" bind:this={chat}>
		Your username is {username}.
		{#if !showConnected}
			Finding a room, please wait...
		{:else}
			<div class="info">
				<p>Connection successful! Start chatting now...</p>
				<a href="/"><button>Exit</button></a>
			</div>
		{/if}

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
		<input type="text" placeholder="Message" bind:value={textfield} />
		<button>Send</button>
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
			.info {
				display: flex;
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
			input {
				flex: 1;
				margin-right: 10px;
				padding: 20px;
				outline: none;
				border-radius: 50px;
				border: 1px solid black;
			}
		}
	}
</style>
