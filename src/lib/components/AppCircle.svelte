<script lang="ts">
	import { IconButton, PauseIcon, PlayerController, PlayIcon } from '$lib';
	import { onDestroy, onMount } from 'svelte';

	const playerController = PlayerController.getContext();

	let innerWidth = $state(window.innerWidth);
	let innerHeight = $state(window.innerHeight);
	let minDimension = $derived(Math.min(innerWidth, innerHeight));
	let size = $derived(Math.min(minDimension, playerController.maxCircleSize));
	let playPauseSize = $derived(size * 0.15);

	onMount(() => {
		playerController.initializeCircle({
			canvas: document.getElementById('circle') as HTMLCanvasElement
		});
	});

	onDestroy(() => {
		playerController.disposeCircle();
	});

	$effect(() => {
		playerController.setMaxCircleSize(size);
	});

	async function handlePlayPause() {
		if (playerController.isPlaying) {
			handlePause();
		} else {
			await playerController.initializeSynth();
			handlePlay();
		}
	}

	function handlePlay() {
		playerController.start();
	}

	function handlePause() {
		playerController.stop();
	}
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="relative flex w-full items-center justify-center">
	<canvas id="circle" style="width: {size}px; height: {size}px;"></canvas>

	{#if !playerController.isPlaying}
		<IconButton size={playPauseSize + 'px'} onclick={handlePlayPause}>
			<PlayIcon />
		</IconButton>
	{:else}
		<IconButton size={playPauseSize + 'px'} onclick={handlePlayPause}>
			<PauseIcon />
		</IconButton>
	{/if}
</div>
