<script lang="ts">
	import { CircleMaxSizeSlider, ControlPanelAdmin, randomString, TuneIcon } from '$lib';

	const name = randomString();

	function showSettingsModal() {
		const settingsModal = document.getElementById(name) as HTMLDialogElement;
		settingsModal.showModal();
	}
</script>

<div class="flex flex-col items-center gap-2">
	<button class="btn btn-outline btn-neutral flex items-center gap-2" onclick={showSettingsModal}>
		<TuneIcon />
		CONFIGURE
	</button>

	<div>
		<CircleMaxSizeSlider />
	</div>
</div>

<dialog id={name} class="modal">
	<div class="modal-box h-11/12 w-11/12 max-w-5xl">
		<h3 class="text-lg font-bold">Settings</h3>
		<p class="py-4">Press ESC key or click the button below to close</p>

		<div>
			<ControlPanelAdmin />
		</div>

		<div class="modal-action">
			<form method="dialog" class="modal-backdrop">
				<button class="btn btn-primary">Close</button>
			</form>
		</div>
	</div>
</dialog>
