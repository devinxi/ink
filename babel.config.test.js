module.exports = {
	presets: [
		['@babel/preset-env', {targets: {node: 'current'}}],
		'@babel/preset-typescript'
	],
	plugins: [
		[
			'babel-plugin-transform-rename-import',
			{
				original: 'solid-js',
				replacement: '..'
			}
		],
		[
			'babel-plugin-jsx-dom-expressions',
			{moduleName: '..', generate: 'universal'}
		]
	]
};
