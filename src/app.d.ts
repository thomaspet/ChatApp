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
/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_CLIENTID: string
	readonly VITE_CLIENTSECRET: string
	readonly VITE_CODE_REDIRECT: string
	readonly VITE_API_URL: string
	readonly VITE_API_TOKEN: string
	// more env variables...
  }
  
  interface ImportMeta {
	readonly env: ImportMetaEnv
  }
  
