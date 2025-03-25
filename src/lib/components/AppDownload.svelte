<script lang="ts">
	import { PlayerController } from '$lib';

	const playerController = PlayerController.getContext();

	let innerWidth = $state(window.innerWidth);
	let isMobile = $derived(innerWidth < 1024);
</script>

<svelte:window bind:innerWidth />

<div class="flex items-center justify-center gap-4" hidden={playerController.isPlaying}>
	{#if isMobile}
		<div class="px-2">
			<p class="text-md text-center">Looking for ear training on mobile?</p>
			<a
				href="https://et.sonofield.com"
				aria-label="Download Sonofield Ear Trainer"
				class="btn btn-link btn-lg"
			>
				Download Sonofield Ear Trainer
			</a>
		</div>
	{:else}
		<a
			href="https://et.sonofield.com"
			aria-label="Download Sonofield Ear Trainer"
			class="btn btn-link"
		>
			Download Sonofield Ear Trainer for iOS and Android.
		</a>
	{/if}
</div>
