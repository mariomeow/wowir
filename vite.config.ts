import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		allowedHosts: ["210e-93-137-194-212.ngrok-free.app"]
	}
})
