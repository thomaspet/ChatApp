<script lang="ts">
import { onDestroy, onMount, tick } from "svelte";


	let messages = []
	let value = "your message..."
	let language = "en";
	let busy = true;
	let eventsource;
	let messagesList;
	let scrollToBottom = false;

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
		scrollToBottom = true;
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

			if (scrollToBottom) {
				tick().then(() => {
					messagesList.scrollTop = messagesList.scrollHeight;
					scrollToBottom = false;
				});
			}
		};
	})

	onDestroy(() => eventsource?.close())
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section class="messages" bind:this={messagesList}>
	{#each messages as m} 
		<p title={m.Timestamp.toLocaleString()}>
			<span>
				<strong>{m.Author}</strong> {m.Timestamp.toLocaleTimeString(language, {hour12: false})}
			</span>
		{m.Message}
		</p>
	{/each}
</section>
<section class="input">

	<input disabled={busy} type="text /" bind:value on:keypress={e => e.key === 'Enter' ? sendMessage() : null }>
	<button disabled={busy} on:click={sendMessage}>send</button>
</section>

<style>
	p {
		margin: 0 0 1.5em 0;
	}

	span {
		display: block;
	}
	section {
		display: flex;
		margin: auto;
		max-width: 700px;
	}

	.messages {
		flex-direction: column;
		align-items: flex-start;

		max-height: 90vh;
		overflow: auto;
		margin-bottom: 1em;
	}

	.input {
		align-items: flex-end;
	}

	button {
		padding: 0;
		box-sizing: border-box;
		border: solid 1px rgb(143, 143, 143);

		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		border-left: unset;
		
		height: 30px;
		width: 10%;
	}

	input {
		padding: 0 1em;
		box-sizing: border-box;
		border: solid 1px rgb(143, 143, 143);
		border-right: unset;

		width: 100%;
		height: 30px;
	}

	input:focus,
	input:focus ~ button {
		outline: none !important;
		border: 2px solid rgba(112, 119, 255, 0.698);
	}

	input:focus {
		border-right: unset;
	}

	input:focus ~ button {
		border-left: unset;
	}

</style>
