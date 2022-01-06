#!/usr/bin/env node
const estrella = require('estrella');
const package = require('./package.json');

const cjs = {
	platform: 'node',
	format: 'cjs',
	bundle: true,
	minify: false,
	plugins: [
		require('esbuild-plugin-alias')({
			'solid-js/store': __dirname + '/node_modules/solid-js/store/dist/dev.js',
			'solid-js/universal':
				__dirname + '/node_modules/solid-js/universal/dist/dev.js',
			'solid-js': __dirname + '/node_modules/solid-js/dist/dev.js'
		})
	],
	external: [
		...Object.keys(package.dependencies ?? {}),
		...Object.keys(package.peerDependencies ?? {})
	]
};

const esm = {
	platform: 'node',
	format: 'esm',
	bundle: true,
	minify: false,
	plugins: [
		require('esbuild-plugin-alias')({
			'solid-js/store': __dirname + '/node_modules/solid-js/store/dist/dev.js',
			'solid-js/universal':
				__dirname + '/node_modules/solid-js/universal/dist/dev.js',
			'solid-js': __dirname + '/node_modules/solid-js/dist/dev.js'
		})
	],
	external: [
		...Object.keys(package.dependencies ?? {}),
		...Object.keys(package.peerDependencies ?? {})
	]
};

function script() {
	estrella.build({
		entry: 'tmp/index.js',
		outfile: 'dist/ink.js',
		...cjs,
		tsc: false
	});

	estrella.build({
		entry: 'tmp/index.js',
		outfile: 'dist/ink.mjs',
		...esm,
		tsc: false
	});
}

script();
