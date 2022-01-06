module.exports = {
	presets: [
		['@babel/preset-env', {targets: {node: 'current'}}],
		'@babel/preset-typescript'
	],
	plugins: [
		[
			'babel-plugin-jsx-dom-expressions',
			{moduleName: 'solid-mdx', generate: 'universal'}
		],
		[
			'babel-plugin-transform-rename-import',
			{
				original: 'solid-js',
				replacement: __dirname + '/'
			}
		],
		[
			'babel-plugin-transform-rename-import',
			{
				original: 'solid-mdx',
				replacement: __dirname + '/'
			},
			'mdx'
		]
	]
};
