<script lang="ts">
	import { page } from '$app/state';
	import { PlayerController, SettingsButtonAdmin, SettingsButtonUser, Wordmark } from '$lib';

	const isAdmin = $derived(page.url.searchParams.get('admin') === 'true');

	let innerWidth = $state(window.innerWidth);
	let wordmarkSize = $derived(Math.min(innerWidth * 0.6, PlayerController.MAX_CIRCLE_SIZE * 0.48));
</script>

<svelte:window bind:innerWidth />

<div class="flex w-full flex-col items-center justify-center gap-8">
	<div style="width: {wordmarkSize}px;">
		<Wordmark />
	</div>

	{#if isAdmin}
		<SettingsButtonAdmin />
	{:else}
		<SettingsButtonUser />
	{/if}
</div>
