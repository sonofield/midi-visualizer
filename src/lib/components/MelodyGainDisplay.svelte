<script lang="ts">
	import { PlayerController } from '$lib';

	const playerController = PlayerController.getContext();

	const handleMidiModWheel = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const value = parseFloat(target.value);
		playerController.setMelodyGain(value);
	};
</script>

<div hidden={!playerController.melodyGainTouched} class="flex items-center justify-center py-2">
	<fieldset class="fieldset w-48">
		<legend class="fieldset-label">Melody Gain</legend>
		<input
			id="melody-gain-display"
			type="range"
			min="0"
			max="1"
			step="0.01"
			value={playerController.melodyGainValue}
			class="range range-primary range-xs"
			oninput={handleMidiModWheel}
		/>
	</fieldset>
</div>
