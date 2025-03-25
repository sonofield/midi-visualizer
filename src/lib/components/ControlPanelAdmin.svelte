<script lang="ts">
	import {
		ChorusConfiguration,
		CurrentKeyField,
		FilterConfiguration,
		FilterEnvelopeConfiguration,
		OctaveHelper,
		PlayerController,
		randomString,
		ReverbConfiguration,
		SynthConfiguration,
		SynthService,
		VolumeConfiguration
	} from '$lib';

	import { Octave } from '$lib/types/octave';
	import { SynthEffect, SynthPreset } from '$lib/types/synth-preset';
	import { onMount } from 'svelte';

	const synthService = SynthService.getContext();
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

	const name = randomString();
</script>

<div class="flex items-center gap-4">
	<div class="flex flex-col gap-1">
		<label for={'midi-device' + name} class="text-sm text-[#F3F0F0]">MIDI Device</label>
		<select
			id={'midi-device' + name}
			value={playerController.selectedMidiDevice?.id || null}
			onchange={handleMidiDeviceChange}
			class="rounded-md border border-[#3A3A3D] bg-[#2A2A2D] px-3 py-2 text-[#F3F0F0] focus:border-[#F3F0F0] focus:outline-none"
		>
			{#each playerController.availableMidiDevices as device}
				<option value={device.id}>{device.manufacturer} {device.name}</option>
			{/each}
		</select>
	</div>

	<div class="flex flex-col gap-1">
		<CurrentKeyField />
	</div>

	<div class="flex flex-col gap-1">
		<label for={'melody-octave' + name} class="text-sm text-[#F3F0F0]">Melody Octave</label>
		<select
			id={'melody-octave' + name}
			value={playerController.currentMelodyOctave.value}
			onchange={handleMelodyOctaveChange}
			class="rounded-md border border-[#3A3A3D] bg-[#2A2A2D] px-3 py-2 text-[#F3F0F0] focus:border-[#F3F0F0] focus:outline-none"
		>
			{#each Octave.asList as octave}
				<option value={octave.value}>{octave.name}</option>
			{/each}
		</select>
	</div>

	<div class="flex flex-col gap-1">
		<label for={'drone-octave' + name} class="text-sm text-[#F3F0F0]">Drone Octave</label>
		<select
			id={'drone-octave' + name}
			value={playerController.currentDroneOctave.value}
			onchange={handleDroneOctaveChange}
			class="rounded-md border border-[#3A3A3D] bg-[#2A2A2D] px-3 py-2 text-[#F3F0F0] focus:border-[#F3F0F0] focus:outline-none"
		>
			{#each Octave.asList as octave}
				<option value={octave.value}>{octave.name}</option>
			{/each}
		</select>
	</div>

	<div class="flex flex-col gap-1">
		<label for={'preset' + name} class="text-sm text-[#F3F0F0]">Synth Preset</label>
		<select
			id={'preset' + name}
			value={playerController.currentPreset.id}
			onchange={handlePresetChange}
			class="rounded-md border border-[#3A3A3D] bg-[#2A2A2D] px-3 py-2 text-[#F3F0F0] focus:border-[#F3F0F0] focus:outline-none"
		>
			{#each SynthPreset.asList as preset}
				<option value={preset.id}>{preset.name}</option>
			{/each}
		</select>
	</div>
</div>

<div class="flex w-full flex-row gap-4 py-2">
	<div class="flex-1 gap-1">
		<VolumeConfiguration
			name="Melody Volume"
			volume={playerController.currentMelodyVolume}
			onUpdateVolume={handleMelodyVolumeChange}
		/>
	</div>
	<div class="flex-1 gap-1">
		<VolumeConfiguration
			name="Drone Volume"
			volume={playerController.currentDroneVolume}
			onUpdateVolume={handleDroneVolumeChange}
		/>
	</div>
</div>

<div class="flex w-full flex-row gap-4 py-2">
	<div class="flex-1 gap-1">
		<SynthConfiguration
			onConfigChange={synthService.configureMelodySynth}
			initialConfig={SynthPreset.default.config}
			title="Melody Synth"
		/>
	</div>
	<div class="flex-1 gap-1">
		<ReverbConfiguration
			onConfigChange={synthService.configureMelodyReverb}
			initialConfig={SynthEffect.reverb.config}
			title="Melody Reverb"
		/>
	</div>
	<div class="flex-1 gap-1">
		<ChorusConfiguration
			onConfigChange={synthService.configureMelodyChorus}
			initialConfig={SynthEffect.chorus.config}
			title="Melody Chorus"
		/>
	</div>
	<div class="flex-1 gap-1">
		<FilterConfiguration
			onConfigChange={synthService.configureMelodyFilter}
			initialConfig={playerController.currentPreset.config.filter}
			title="Melody Filter"
		/>
	</div>
	<div class="flex-1 gap-1">
		<FilterEnvelopeConfiguration
			onConfigChange={synthService.configureMelodyFilterEnvelope}
			initialConfig={playerController.currentPreset.config.filterEnvelope}
			title="Melody Filter Envelope"
		/>
	</div>
</div>

<div class="flex w-full flex-row gap-4 py-2">
	<div class="flex-1 gap-1">
		<SynthConfiguration
			onConfigChange={synthService.configureDroneSynth}
			initialConfig={SynthPreset.drone.config}
			title="Drone Synth"
		/>
	</div>
	<div class="flex-1 gap-1">
		<ReverbConfiguration
			onConfigChange={synthService.configureDroneReverb}
			initialConfig={SynthEffect.reverb.config}
			title="Drone Reverb"
		/>
	</div>
	<div class="flex-1 gap-1">
		<ChorusConfiguration
			onConfigChange={synthService.configureDroneChorus}
			initialConfig={SynthEffect.chorus.config}
			title="Drone Chorus"
		/>
	</div>
	<div class="flex-1 gap-1">
		<FilterConfiguration
			onConfigChange={synthService.configureDroneFilter}
			initialConfig={SynthPreset.drone.config.filter}
			title="Drone Filter"
		/>
	</div>
	<div class="flex-1 gap-1">
		<FilterEnvelopeConfiguration
			onConfigChange={synthService.configureDroneFilterEnvelope}
			initialConfig={SynthPreset.drone.config.filterEnvelope}
			title="Drone Filter Envelope"
		/>
	</div>
</div>
