<script lang="ts">
	import './app.scss';
</script>

<header>
	<h1>Make A Bud</h1>
	<p class="text-animation">The online chatting platform</p>
</header>

<div class="main-container">
	<slot />
</div>

<style lang="scss">
	.main-container {
		height: calc(100% - 100px);
	}
	.prompt {
		width: 28ch;
		//letter-spacing: .1em;
		border-right: 3px solid;
		white-space: nowrap;
		overflow: hidden;
		font-size: 1em;
		animation:
			typing 2s steps(28),
			blink 0.5s step-end infinite alternate;
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
