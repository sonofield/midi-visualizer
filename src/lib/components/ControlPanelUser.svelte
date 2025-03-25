<script lang="ts">
	import { CurrentKeyField, OctaveHelper, PlayerController, VolumeConfiguration } from '$lib';

	import { Octave } from '$lib/types/octave';
	import { SynthPreset } from '$lib/types/synth-preset';
	import { onMount } from 'svelte';

	const playerController = PlayerController.getContext();

	onMount(() => {
		playerController.requestMidiAccessAndGetDevices();
	});

	function handleMidiDeviceChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		const value = select.value;
		playerController.setSelectedMidiDevice(value);
	}

	function handleMelodyOctaveChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		const value = parseInt(select.value);
		const newOctave = OctaveHelper.getOctaveByValue(value);
		playerController.setMelodyOctave(newOctave);
	}

	function handleDroneOctaveChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		const value = parseInt(select.value);
		const newOctave = OctaveHelper.getOctaveByValue(value);
		playerController.setDroneOctave(newOctave);
	}

	function handlePresetChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		const value = select.value;
		playerController.setPreset(value);
	}

	function handleMelodyVolumeChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const value = parseFloat(input.value);
		playerController.setMelodyVolume(value);
	}

	function handleDroneVolumeChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const value = parseFloat(input.value);
		playerController.setDroneVolume(value);
	}
</script>

<div class="flex flex-col gap-4">
	<div class="lg:flex lg:flex-row lg:gap-4">
		<div class="lg:flex-1">
			<CurrentKeyField />
		</div>

		<div class="lg:flex-1"></div>
	</div>

	<div class="flex flex-col gap-4 lg:flex-row">
		<div class="lg:flex-1">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Synth Preset</legend>
				<select
					value={playerController.currentPreset.id}
					onchange={handlePresetChange}
					class="select"
				>
					{#each SynthPreset.asList as preset}
						<option value={preset.id}>{preset.name}</option>
					{/each}
				</select>
			</fieldset>
		</div>

		<div class="lg:flex-1">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">MIDI Device</legend>
				<select
					value={playerController.selectedMidiDevice?.id || null}
					onchange={handleMidiDeviceChange}
					class="select"
				>
					{#each playerController.availableMidiDevices as device}
						<option value={device.id}>{device.manufacturer} {device.name}</option>
					{/each}
				</select>
			</fieldset>
		</div>
	</div>

	<div class="flex flex-col gap-4 lg:flex-row">
		<div class="lg:flex-1">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Drone Octave</legend>
				<select
					value={playerController.currentDroneOctave.value}
					onchange={handleDroneOctaveChange}
					class="select"
				>
					{#each Octave.asList as octave}
						<option value={octave.value}>{octave.name}</option>
					{/each}
				</select>
			</fieldset>
		</div>

		<div class="lg:flex-1">
			<VolumeConfiguration
				name="Drone Volume"
				volume={playerController.currentDroneVolume}
				onUpdateVolume={handleDroneVolumeChange}
			/>
		</div>
	</div>

	<div class="flex flex-col gap-4 lg:flex-row">
		<div class="lg:flex-1">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Melody Octave (circle tapping only)</legend>
				<select
					value={playerController.currentMelodyOctave.value}
					onchange={handleMelodyOctaveChange}
					class="select"
				>
					{#each Octave.asList as octave}
						<option value={octave.value}>{octave.name}</option>
					{/each}
				</select>
			</fieldset>
		</div>

		<div class="lg:flex-1">
			<VolumeConfiguration
				name="Melody Volume"
				volume={playerController.currentMelodyVolume}
				onUpdateVolume={handleMelodyVolumeChange}
			/>
		</div>
	</div>
</div>
