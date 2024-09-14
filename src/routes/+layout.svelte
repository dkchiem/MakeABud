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
