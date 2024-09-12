<script lang="ts">
	export let messageFromSelf: boolean;
	export let username: string;
</script>

<div class="bubble" class:right={messageFromSelf} class:left={!messageFromSelf}>
	<slot />
	<span class="username">{username}</span>
</div>

<style lang="scss">
	.bubble {
		padding: 10px 20px;
		border: 2px black solid;
		color: black;
		margin-bottom: calc(5px + 1rem);
		position: relative;
		.username {
			position: absolute;
			font-size: 0.7rem;
			bottom: -1rem;
		}
		&.left {
			align-self: flex-start;
			border-radius: 15px 15px 15px 0;
			.username {
				left: 0;
			}
		}
		&.right {
			align-self: flex-end;
			border-radius: 15px 15px 0 15px;
			.username {
				right: 0;
			}
		}
	}
</style>
