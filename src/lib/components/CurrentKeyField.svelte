<script lang="ts">
	import { NoteNameHelper, PlayerController, randomString, ShuffleIcon } from '$lib';

	import { NoteName } from '$lib/types/note-name';

	const { showLegend = true } = $props();

	const playerController = PlayerController.getContext();

	function handleKeyChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		const value = select.value as string;
		const newKey = NoteNameHelper.getNoteNameByName(value);
		playerController.setKey(newKey);
	}

	function handleRandomKey() {
		playerController.setRandomKey();
	}

	const name = randomString();
</script>

<fieldset class="fieldset flex-1">
	{#if showLegend}
		<legend class="fieldset-legend">Key</legend>
	{/if}
	<div class="flex flex-row items-center gap-2">
		<select
			id={name}
			value={playerController.currentKey.name}
			onchange={handleKeyChange}
			class="select"
			class:select-sm={!showLegend}
		>
			{#each NoteName.asToneList as note}
				<option value={note.name}>{note.name}</option>
			{/each}
		</select>
		<button onclick={handleRandomKey} class="btn btn-sm btn-ghost btn-circle">
			<ShuffleIcon />
		</button>
	</div>
</fieldset>
