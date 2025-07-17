import type { USER_TYPE } from "$lib/types"

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: USER_TYPE
		}
		interface PageData {
			user: USER_TYPE
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export { }
