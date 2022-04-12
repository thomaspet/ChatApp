<script context="module" lang="ts">
	export const prerender = false;
	export const hydrate = true;
</script>

<script lang="ts">
import { onMount } from "svelte";


	let messages = []
	let value = "your message..."

	async function sendMessage() {
		console.log(value)
		await fetch("http://localhost:8080/messages", {
			method: "POST",
			headers: {
				"Content-Type": "text/plain"
			},
			body: value
		});
	}

	onMount(() => {
		let e = new EventSource('http://localhost:8080/events/messages');
		e.onopen = () => {
			console.log("opened");
		}
		e.onerror = (e) => {
			console.log("error", e);
		}
		e.onmessage = function(event) {
			messages = [...messages, event.data];
		};
	})
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	{#each messages as message} 
		<p>{message}</p>
	{/each}

	<input type="text /" bind:value>
	<button on:click={sendMessage}>send</button>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

</style>
