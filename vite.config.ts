import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		allowedHosts: ["f41c-93-137-206-99.ngrok-free.app"]
	}
})
