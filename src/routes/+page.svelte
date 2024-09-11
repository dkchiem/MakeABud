<div class="container">
	<div>
		<p>Found a bug? Let us know!</p>
		<a href="https://forms.gle/BZwUN3MJiZXhjrar5"><button class="bug">I found a bug!</button></a>
		<p>What are you interested in?(Optional)</p>
		<textarea
			rows="4"
			cols="20"
			placeholder="What are you interested in? Say &quot;Cars&quot; for example."
		/>
	</div>
	<a href="/chat"><button class="start">Start chatting</button></a>
</div>

<style lang="scss">
	.bug {
		text-align: center;
		margin: 20px 0;
	.start {
		text-align: center;
		margin: 20 px 0;
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
			border-radius: 5px;
			padding: 20px;
			width: 300px;
			font-size: 1rem;
			font-family:'Reddit Mono', monospace;
		}
	}
</style>
