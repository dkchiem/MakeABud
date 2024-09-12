<script lang="ts">
	import { usernameStore } from '$lib/user';

	let username: string;

	function start() {
		if (username) {
			usernameStore.set(username);
		}
	}
</script>

<div class="container">
	<div>
		<p>Found a bug? Let us know!</p>
		<a href="https://forms.gle/BZwUN3MJiZXhjrar5"><button class="bug">I found a bug!</button></a>
		<p>Enter a username:</p>
		<input placeholder="Say &quot;FunkyMonkey123&quot; for example." bind:value={username} />
	</div>
	<p class="topics">Enter specific topics you like (Optional)</p>
	<textarea placeholder="What are you interested in? Say &quot;Cars&quot; for example." />
	<a href="/chat"><button class="start" on:click={start}>Start chatting</button></a>
</div>

<style lang="scss">
	.bug {
		text-align: center;
		margin: 20px 0;
		.start {
			text-align: center;
			margin: 20px 0px;
		}
	}
	.container {
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		textarea {
			margin: 5px;
			border-radius: 5px;
			padding: 10px;
			width: 300px;
			font-size: 1rem;
			font-family: 'Reddit Mono', monospace;
		}
		.topics {
			margin: 5px;
		}
		input {
			margin: 10px;
			padding: 10px;
			width: 100%;
			border: 1px solid black;
			font-size: 1rem;
			font-family: 'Reddit Mono', monospace;
			border-radius: 5px;
			background-position: 10 px 10 px;
			transition: width 0.4s ease-in-out;
		}
	}
</style>
