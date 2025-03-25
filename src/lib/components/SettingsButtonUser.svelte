<script lang="ts">
	import { ControlPanelUser, CurrentKeyField, randomString, TuneIcon } from '$lib';

	const name = randomString();

	function showSettingsModal() {
		const settingsModal = document.getElementById(name) as HTMLDialogElement;
		settingsModal.showModal();
	}
</script>

<div class="flex flex-col items-center gap-2">
	<button
		class="btn btn-outline btn-neutral btn-sm flex items-center gap-2"
		onclick={showSettingsModal}
	>
		<TuneIcon />
		SETTINGS
	</button>

	<div>
		<CurrentKeyField showLegend={false} />
	</div>
</div>

<dialog id={name} class="modal">
	<div class="modal-box max-h-xl w-11/12 max-w-2xl">
		<h3 class="text-lg font-bold">Settings</h3>
		<form method="dialog" id="xmodal">
			<button class="btn btn-sm btn-circle btn-ghost absolute top-4 right-4">✕</button>
		</form>

		<div class="pt-4">
			<ControlPanelUser />
		</div>
		<div class="modal-action">
			<form method="dialog" id="bmodal">
				<button class="btn btn-primary">CLOSE</button>
			</form>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>CLOSE</button>
	</form>
</dialog>

<style>
	.max-h-xl {
		max-height: var(--container-2xl);
	}
</style>
