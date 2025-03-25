<script lang="ts">
	import {
		AppDownload,
		AppTitle,
		CircleService,
		CurrentKeyService,
		CurrentOctaveService,
		CurrentPresetService,
		MidiService,
		PlayerController,
		SynthService
	} from '$lib';
	import { CurrentVolumeService } from '$lib/services/current-volume-service.svelte';
	import '../app.css';
	let { children } = $props();

	// Initialize services
	const currentPresetService = CurrentPresetService.initializeContext();
	const currentKeyService = CurrentKeyService.initializeContext();
	const currentOctaveService = CurrentOctaveService.initializeContext();
	const currentVolumeService = CurrentVolumeService.initializeContext();
	const circleService = CircleService.initializeContext();
	const midiService = MidiService.initializeContext();
	const synthService = SynthService.initializeContext({
		currentPresetService,
		currentVolumeService,
		tonicService: currentKeyService,
		octaveService: currentOctaveService
	});
	PlayerController.initializeContext({
		synthService,
		tonicService: currentKeyService,
		volumeService: currentVolumeService,
		circleService,
		presetService: currentPresetService,
		octaveService: currentOctaveService,
		midiService
	});
</script>

<svelte:head>
	<title>Sonofield Circle</title>
	<meta
		name="description"
		content="Sonofield Circle helps you train your ear with the Circle of Fifths by tapping the circle or using MIDI."
	/>
	<meta name="keywords" content="Sonofield, Ear Trainer, Circle, MIDI, Circle of Fifths" />
	<meta name="author" content="Sonofield" />
</svelte:head>

<div class="flex min-h-screen flex-col overflow-auto">
	<div class="my-auto flex flex-1 flex-col">
		<header class="flex w-full flex-1 pt-16">
			<AppTitle />
		</header>

		<main class="flex flex-1 flex-col pb-16 lg:pb-8">
			{@render children()}
		</main>
	</div>

	<footer class="fixed bottom-0 left-0 w-full px-4 py-2">
		<AppDownload />
	</footer>
</div>

<style>
	:global(body) {
		margin: 0;
		min-height: 100vh;
		background-color: #1a1a1d;
		display: flex;
		flex-direction: column;
	}
</style>
