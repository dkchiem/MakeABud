<script lang="ts">
	import './app.scss';
</script>

<header>
	<h1>Make A Bud</h1>
	<p class="prompt">The online chatting platform</p>
</header>

<div class="main-container">
	<slot />
</div>

<style lang="scss">
	.main-container {
		height: calc(100% - 100px);
	}
	.prompt {
<<<<<<< HEAD
		width: 28ch;
		letter-spacing: 0.1em;
=======
		width:28ch;
		//letter-spacing: .1em;
>>>>>>> 5c56bcb44d7e8fb12780534a520b896e15151942
		border-right: 3px solid;
		white-space: nowrap;
		overflow: hidden;
		font-size: 1em;
<<<<<<< HEAD
		animation:
			typing 2s steps(28),
			blink 0.5 step-end infinite alternate;
=======
		animation: typing 2s steps(28), blink .5s step-end infinite alternate;
>>>>>>> 5c56bcb44d7e8fb12780534a520b896e15151942
	}
	@keyframes blink {
		50% {
			border-color: transparent;
		}
	}
	@keyframes typing {
		from {
			width: 0;
		}
	}

	header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100px;
		h1 {
			text-align: center;
		}
	}
</style>
