import {defineConfig, PluginOption} from 'vite';
import solidPlugin from '@vinxi/vite-plugin-solid';
import inspect from 'vite-plugin-inspect';
// const estrella = require('estrella');

export default defineConfig(
	() =>
		({
			build: {
				lib: {
					entry: './src/index.ts',
					formats: ['es'],
					fileName: 'index',
					name: 'SolidInk'
				},
				rollupOptions: {
					output: {
						dir: './tmp'
					}
				}
			},
			plugins: [
				// {
				// 	name: 'builder',
				// 	buildEnd: async () => {
				// 		estrella.build(this.)
				// 	}
				// } as PluginOption,
				// mdx({
				// 	transformMDX: code => {
				// 		return code.replace(/<\!--[a-zA-Z\.\s]+-->/g, ` `);
				// 	},
				// 	xdm: {
				// 		remarkPlugins: [(await import('remark-gfm')).default]
				// 	}
				// }),
				// for the playground, we need to be able to use the solid-three package itself
				solidPlugin({
					solid: {
						moduleName: '/src/solid-ink.tsx',
						// @ts-ignore
						generate: 'dynamic',
						renderers: [
							// {
							// 	name: 'dom',
							// 	moduleName: 'solid-js/web'
							// 	// elements: [...HTMLElements, ...SVGElements]
							// },
							{
								name: 'universal',
								moduleName: '/src/solid-ink.tsx',
								elements: []
							}
						]
					}
				}),
				inspect()
			],
			resolve: {
				alias: {
					'solid-js/store': './node_modules/solid-js/store/dist/dev.js',
					'solid-js/universal': './node_modules/solid-js/universal/dist/dev.js',
					'solid-js': './node_modules/solid-js/dist/dev.js'
				}
			}
		} as any)
);
