<script lang="ts">
	import { randomString } from '$lib';

	let { onConfigChange, initialConfig, title } = $props();

	let decay = $state(initialConfig.decay);
	let preDelay = $state(initialConfig.preDelay);
	let wet = $state(initialConfig.wet);

	$effect(() => {
		const config = {
			decay,
			preDelay,
			wet
		};
		onConfigChange(config);
	});

	const name = randomString();
</script>

<div class="bg-opacity-10 rounded-lg bg-[#333333] p-4 backdrop-blur-sm">
	<h2 class="mb-4 text-xl text-[#FAFAF0]">{title}</h2>

	<div class="space-y-6">
		<!-- Decay -->
		<div>
			<label class="mb-1 block text-sm text-[#FAFAF0]" for={'decay' + name}>
				Decay: {decay?.toFixed(2)}
			</label>
			<input
				type="range"
				id={'decay' + name}
				bind:value={decay}
				min="0.1"
				max="5"
				step="0.1"
				class="w-full accent-[#000000]"
			/>
		</div>

		<!-- Pre Delay -->
		<div>
			<label class="mb-1 block text-sm text-[#FAFAF0]" for={'preDelay' + name}>
				Pre Delay: {preDelay?.toFixed(2)}
			</label>
			<input
				type="range"
				id={'preDelay' + name}
				bind:value={preDelay}
				min="0"
				max="5"
				step="0.01"
				class="w-full accent-[#000000]"
			/>
		</div>

		<!-- Wet Level -->
		<div>
			<label class="mb-1 block text-sm text-[#FAFAF0]" for={'wet' + name}>
				Wet Level: {wet?.toFixed(2)}
			</label>
			<input
				type="range"
				id={'wet' + name}
				bind:value={wet}
				min="0"
				max="1"
				step="0.01"
				class="w-full accent-[#000000]"
			/>
		</div>
	</div>
</div>
