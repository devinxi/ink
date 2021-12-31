import {defineConfig} from 'vite';
import solidPlugin from '@vinxi/vite-plugin-solid';
import inspect from 'vite-plugin-inspect';

export default defineConfig(() => ({
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
			'solid-js': './node_modules/solid-js/dist/dev.js'
		}
	}
}));
