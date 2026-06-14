import { defineConfig } from 'vite'
import { join } from 'node:path'

export default defineConfig({
	build: {
		outDir: join(import.meta.dirname, 'dist-tmp'),
		emptyOutDir: true,
		rollupOptions: {
			input: join(import.meta.dirname, 'src/intros-main.js'),
			output: {
				entryFileNames: 'js/intros-files.js',
				format: 'iife',
			},
		},
		minify: false,
		sourcemap: false,
	},
})
