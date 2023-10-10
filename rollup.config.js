import babel from '@rollup/plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import pkg from './package.json';

import process from 'process';
process.env.NODE_ENV = 'production';

const externalPackages = ['axios', 'form-data', 'isomorphic-ws', 'base64-js', /@babel\/runtime/];

const extensions = ['.mjs', '.json', '.node', '.js', '.ts'];

const babelConfig = {
	babelHelpers: 'runtime',
	exclude: 'node_modules/**',
	extensions,
};

const baseConfig = {
	input: 'src/index.ts',
	cache: false,
	watch: {
		chokidar: false,
	},
};

const normalBundle = {
	...baseConfig,
	output: [
		{
			file: pkg.main,
			format: 'cjs',
			sourcemap: true,
		},
		{
			file: pkg.module,
			format: 'es',
			sourcemap: true,
		},
	],
	external: externalPackages.concat(['https', 'jsonwebtoken', 'crypto']),
	plugins: [
		replace({ preventAssignment: true, 'process.env.PKG_VERSION': JSON.stringify(pkg.version) }),
		external(),
		nodeResolve({ extensions }),
		babel(babelConfig),
		commonjs(),
	],
};

export default () => [normalBundle];
