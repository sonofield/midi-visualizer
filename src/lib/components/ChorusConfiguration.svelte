<script lang="ts">
	import { randomString } from '$lib';

	let { onConfigChange, initialConfig, title } = $props();

	let depth = $state(initialConfig.depth);
	let feedback = $state(initialConfig.feedback);
	let delayTime = $state(initialConfig.delayTime);
	let wet = $state(initialConfig.wet);
	let type = $state(initialConfig.type);
	let spread = $state(initialConfig.spread);
	let frequency = $state(initialConfig.frequency);

	$effect(() => {
		const config = {
			depth,
			feedback,
			delayTime,
			wet,
			type,
			spread,
			frequency
		};
		onConfigChange(config);
	});

	const name = randomString();
</script>

<div class="bg-opacity-10 rounded-lg bg-[#333333] p-4 backdrop-blur-sm">
	<h2 class="mb-4 text-xl text-[#FAFAF0]">{title}</h2>

	<div class="space-y-6">
		<!-- Depth -->
		<div>
			<label class="mb-1 block text-sm text-[#FAFAF0]" for={'depth' + name}>
				Depth: {depth?.toFixed(2)}
			</label>
			<input
				type="range"
				id={'depth' + name}
				bind:value={depth}
				min="0"
				max="1"
				step="0.01"
				class="w-full accent-[#000000]"
			/>
		</div>

		<!-- Feedback -->
		<div>
			<label class="mb-1 block text-sm text-[#FAFAF0]" for={'feedback' + name}>
				Feedback: {feedback?.toFixed(2)}
			</label>
			<input
				type="range"
				id={'feedback' + name}
				bind:value={feedback}
				min="0"
				max="1"
				step="0.01"
				class="w-full accent-[#000000]"
			/>
		</div>

		<!-- Delay Time -->
		<div>
			<label class="mb-1 block text-sm text-[#FAFAF0]" for={'delayTime' + name}>
				Delay Time: {delayTime?.toFixed(2)} ms
			</label>
			<input
				type="range"
				id={'delayTime' + name}
				bind:value={delayTime}
				min="0"
				max="40"
				step="0.1"
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

		<!-- Type -->
		<div>
			<label class="mb-1 block text-sm text-[#FAFAF0]" for={'type' + name}> Type </label>
			<select
				id={'type' + name}
				bind:value={type}
				class="w-full rounded-md border border-[#3A3A3D] bg-[#2A2A2D] px-3 py-2 text-[#F3F0F0] focus:border-[#F3F0F0] focus:outline-none"
			>
				<option value="sine">Sine</option>
				<option value="square">Square</option>
				<option value="triangle">Triangle</option>
				<option value="sawtooth">Sawtooth</option>
			</select>
		</div>

		<!-- Spread -->
		<div>
			<label class="mb-1 block text-sm text-[#FAFAF0]" for={'spread' + name}>
				Spread: {spread?.toFixed(2)}
			</label>
			<input
				type="range"
				id={'spread' + name}
				bind:value={spread}
				min="0"
				max="180"
				step="1"
				class="w-full accent-[#000000]"
			/>
		</div>

		<!-- Frequency -->
		<div>
			<label class="mb-1 block text-sm text-[#FAFAF0]" for={'frequency' + name}>
				Frequency: {frequency?.toFixed(2)} Hz
			</label>
			<input
				type="range"
				id={'frequency' + name}
				bind:value={frequency}
				min="0"
				max="3"
				step="0.1"
				class="w-full accent-[#000000]"
			/>
		</div>
	</div>
</div>
