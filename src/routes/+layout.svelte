<script lang="ts">
	import './app.scss';
</script>

<header>
	<h1>Make A Bud</h1>
</header>

<slot />

<style lang="scss">
	header {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80px;
		h1 {
			text-align: center;
		}
	}
</style>
