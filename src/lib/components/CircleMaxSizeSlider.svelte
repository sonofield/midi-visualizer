<script lang="ts">
	import { PlayerController } from '$lib';

	const playerController = PlayerController.getContext();

	function handleChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const value = parseInt(input.value);
		playerController.setMaxCircleSize(value);
	}
</script>

<fieldset class="fieldset">
	<legend class="fieldset-label">Circle Size</legend>
	<input class="range" type="range" min="100" max="2000" step="10" oninput={handleChange} />
</fieldset>
