<script lang="ts">
import { onDestroy, onMount } from "svelte";


	let messages = []
	let value = "your message..."
	let language = "en";
	let busy = true;
	let eventsource;

	let apiUrl = import.meta.env.VITE_API_URL;

	if (apiUrl.endsWith("/")) {
		apiUrl = apiUrl.slice(0, -1);
	}

	async function sendMessage() {

		await fetch("api/messages", {
			method: "POST",
			headers: {
				"Content-Type": "text/plain",
			},
			body: value
		});

		value = "";
	}

	onMount(() => {
		language = navigator.language || navigator.languages[0]
		fetch("api/messages")
			.finally(() => {
					busy = false;
			})
			.then(res => res.json())
			.then(res => {
				messages = res.map(m => ({...m, Timestamp: new Date(m.Timestamp)}))
			})

		eventsource?.close()
		// Todo pass this through the BFF?
		eventsource = new EventSource(`${apiUrl}/events/messages`);
		eventsource.onopen = () => {
			console.log("opened");
		}
		eventsource.onerror = (e) => {
			console.log("error", e);
		}
		eventsource.onmessage = function(event) {
			const json = JSON.parse(event.data)
			json.Timestamp = new Date(json.Timestamp)
			messages = [...messages, json];
		};
	})

	onDestroy(() => eventsource?.close())
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	{#each messages as m} 
		<p title={m.Timestamp.toLocaleString()}>({m.Timestamp.toLocaleTimeString(language, {hour12: false})}) {m.Author}: {m.Message}</p>
	{/each}

	<input disabled={busy} type="text /" bind:value on:keypress={e => e.key === 'Enter' ? sendMessage() : null }>
	<button disabled={busy} on:click={sendMessage}>send</button>
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
