<script lang="ts">
	let { onclick, size, children } = $props();
</script>

<button
	{onclick}
	class="absolute flex items-center justify-center"
	style="width: {size}; height: {size};"
>
	{@render children()}
</button>
