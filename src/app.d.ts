/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces
declare namespace App {
	interface Locals {
		userid: string;
	}

	// interface Platform {}

	interface Session {
		userid: string;
		authenticated: boolean;
		displayName: string; // preferred_username ?? name ?? email
	}

	// interface Stuff {}
}
