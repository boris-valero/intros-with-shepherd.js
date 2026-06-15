import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
	build: {
		outDir: 'dist-tmp',
		emptyOutDir: true,
		rollupOptions: {
			input: {
				'intros-files': resolve('src/intros-files.js'),
				'intros-dashboard': resolve('src/intros-dashboard.js'),
			},
			output: {
				entryFileNames: 'js/[name].mjs',
				chunkFileNames: 'js/[name].mjs',
				format: 'es',
				manualChunks: function (id) {
					if (id.includes('node_modules/shepherd.js')) {
						return 'intros-shepherd'
					}
				},
			},
			preserveEntrySignatures: 'allow-extension',
		},
		minify: false,
		sourcemap: false,
	},
	test: {
		environment: 'jsdom',
		include: ['tests/**/*.test.js'],
	},
})
