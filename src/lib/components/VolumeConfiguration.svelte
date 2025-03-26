<script lang="ts">
	let { name, volume, onUpdateVolume } = $props();
</script>

<fieldset class="fieldset">
	<legend class="fieldset-legend">
		{name}: {volume} db
	</legend>
	<input
		id={name}
		type="range"
		value={volume}
		onchange={onUpdateVolume}
		min="-64"
		max="0"
		step="1"
		class="range"
	/>
</fieldset>
