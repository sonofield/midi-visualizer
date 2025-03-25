<script lang="ts">
	import { randomString } from '$lib';

	let { onConfigChange, initialConfig, title } = $props();

	let rolloff = $state(initialConfig.rolloff);
	let Q = $state(initialConfig.Q);
	let type = $state(initialConfig.type);
	// let detune = $state(initialConfig.detune);

	$effect(() => {
		const config = {
			rolloff,
			Q,
			type
			// detune
		};
		onConfigChange(config);
	});

	const name = randomString();
</script>

<div class="bg-opacity-10 rounded-lg bg-[#333333] p-4 backdrop-blur-sm">
	<h2 class="mb-4 text-xl text-[#FAFAF0]">{title}</h2>

	<div class="space-y-6">
		<!-- Type -->
		<div>
			<label class="mb-1 block text-sm text-[#FAFAF0]" for={'type' + name}> Type </label>
			<select
				id={'type' + name}
				bind:value={type}
				class="w-full rounded-md border border-[#3A3A3D] bg-[#2A2A2D] px-3 py-2 text-[#F3F0F0] focus:border-[#F3F0F0] focus:outline-none"
			>
				<option value="lowpass">Lowpass</option>
				<option value="highpass">Highpass</option>
				<option value="bandpass">Bandpass</option>
				<option value="lowshelf">Lowshelf</option>
				<option value="highshelf">Highshelf</option>
				<option value="notch">Notch</option>
				<option value="allpass">Allpass</option>
				<option value="peaking">Peaking</option>
			</select>
		</div>

		<!-- Detune -->
		<!-- <div>
			<label class="mb-1 block text-sm text-[#FAFAF0]" for={'detune' + name}>
				Detune: {detune} cents
			</label>
			<input
				type="range"
				id={'detune' + name}
				bind:value={detune}
				min="-100"
				max="100"
				step="1"
				class="w-full accent-[#000000]"
			/>
		</div> -->

		<!-- Q -->
		<div>
			<label class="mb-1 block text-sm text-[#FAFAF0]" for={'Q' + name}>
				Q: {Q}
			</label>
			<input
				type="range"
				id={'Q' + name}
				bind:value={Q}
				min="1"
				max="8"
				step="1"
				class="w-full accent-[#000000]"
			/>
		</div>

		<!-- Rolloff -->
		<div>
			<label class="mb-1 block text-sm text-[#FAFAF0]" for={'rolloff' + name}>
				Rolloff: {rolloff} db
			</label>
			<select
				id={'rolloff' + name}
				bind:value={rolloff}
				class="w-full rounded-md border border-[#3A3A3D] bg-[#2A2A2D] px-3 py-2 text-[#F3F0F0] focus:border-[#F3F0F0] focus:outline-none"
			>
				<option value={-12}> -12 </option>
				<option value={-24}> -24 </option>
				<option value={-48}> -48 </option>
				<option value={-96}> -96 </option>
			</select>
		</div>
	</div>
</div>
