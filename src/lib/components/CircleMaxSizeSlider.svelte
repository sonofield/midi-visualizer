<script lang="ts">
	import { PlayerController } from '$lib';

	const playerController = PlayerController.getContext();

	let innerWidth = $state(window.innerWidth);
	let innerHeight = $state(window.innerHeight);
	let minDimension = $derived(Math.round(Math.min(innerWidth, innerHeight) / 10) * 10);

	function handleChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const value = parseInt(input.value);
		playerController.setMaxCircleSize(value);
	}
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<fieldset class="fieldset w-48">
	<legend class="fieldset-label">Circle Size ({playerController.maxCircleSize})</legend>
	<input
		class="range range-xs range-neutral"
		type="range"
		min="400"
		max={minDimension}
		step="10"
		oninput={handleChange}
	/>
</fieldset>
