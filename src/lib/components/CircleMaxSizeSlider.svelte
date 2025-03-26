<script lang="ts">
	import { PlayerController } from '$lib';

	const playerController = PlayerController.getContext();

	function handleChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const value = parseInt(input.value);
		playerController.setMaxCircleSize(value);
	}
</script>

<fieldset class="fieldset w-48">
	<legend class="fieldset-label">Circle Size ({playerController.maxCircleSize})</legend>
	<input
		class="range range-xs range-neutral"
		type="range"
		min="400"
		max="2000"
		step="10"
		oninput={handleChange}
	/>
</fieldset>
