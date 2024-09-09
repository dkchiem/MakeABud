<p class="prompt">The online chatting platform</p>
<div class="container">
	<div>
		<p>Rules</p>
		<p>- Do not leak your IP</p>
		<p>- Do not send threats</p>
		<p>- Do not solicit</p>

		<p>What are you interested in?(Optional)</p>
		<textarea
			rows="4"
			cols="20"
			placeholder="What are you interested in? Say &quot;Cars&quot; for example."
		/>
	</div>
	<a href="/chat"><button>Start</button></a>
</div>

<style lang="scss">
	.prompt {
		text-align: center;
	}
	.container {
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
		textarea {
			border-radius: 5px;
			padding: 20px;
			width: 300px;
			font-size: 1rem;
		}
		button {
			width: 300px;
			height: 55px;
			font-size: 1.5rem;
		}
	}
</style>
