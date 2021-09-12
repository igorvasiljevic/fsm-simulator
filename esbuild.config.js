const { build: esbuild } = require('esbuild');
const { copy: fscopy } = require('fs-extra');

const src_dir = 'src/';
const sw_path = src_dir + 'sw.js';

const args = process.argv.slice(2);
const out_dir = args.find(arg => arg.startsWith('--out='))?.split('=')[1] || 'dist/';
const minify = args.find(arg => arg === '--minify') ? true : false;

const copy_list = [
	'manifest.webmanifest',

	'index.html',
	'simulator.html',
	'lessons',

	'favicon.ico',
	'res/icon.svg',
	'res/icon.png',
	'res/icon-maskable.svg',
	'res/icon-maskable.png',
];

const time = async (fun, t) => (t = Date.now(), await fun(), Date.now() - t);
const copy = path => fscopy(src_dir + path, out_dir + path);

const build_main = () => esbuild({
	entryPoints: [`${src_dir}index.js`],
	outfile: `${out_dir}bundle.js`,
	charset: 'utf8',
	bundle: true,
	format: 'iife',
	minify: minify,
	// plugins: [],
	loader: {
		'.svg': 'text',
		'.file.svg': 'file',
		'.base64.svg': 'base64'
	},
	jsxFactory: '__jsx',
	jsxFragment: '__jsx_fragment'
}).catch(console.log);

const build_sw = () => esbuild({
	entryPoints: [sw_path],
	outfile: `${out_dir}sw.js`,
	minify: minify,
}).catch(console.log);

(async () => {

	process.stdout.write(`Finished in \x1b[32m${await time(async () => {
		await build_main();
		await build_sw();
		for (let promise of copy_list.map(copy)) await promise;
	})}\x1b[0m ms\n`);

	if (args.find(arg => arg === '--watch')) {
		const { watch } = require('chokidar');
		const { resolve } = require('path');

		const copied = copy_list.map(path => resolve(src_dir + path));

		watch(src_dir)
			.on('change', async (path, stats) => {
				process.stdout.write(`[watch] change in \x1b[33m${path}\x1b[0m... `);

				const clean_path = path.replaceAll('\\', '/');
				const full_path = resolve(clean_path);
				if (clean_path === sw_path) {
					time(build_sw)
						.then(t => process.stdout.write(`built sw in \x1b[32m${t}\x1b[0m ms\n`));
				} else if (copied.find(file => full_path.startsWith(file))) {
					time(() => copy(clean_path.replace(src_dir, '')))
						.then(t => process.stdout.write(`copied in \x1b[32m${t}\x1b[0m ms\n`));
				} else {
					time(build_main)
						.then(t => process.stdout.write(`built main in \x1b[32m${t}\x1b[0m ms\n`));
				}
			});
	}


	if (args.find(arg => arg === '--serve')) {
		const { start } = require('live-server');

		start({
			port: 8181, // Set the server port. Defaults to 8080.
			host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
			root: out_dir, // Set root directory that's being served. Defaults to cwd.
			open: false, // When false, it won't load your browser by default.
			wait: 50, // Waits for all changes, before reloading. Defaults to 100ms.
			logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
		});

	}

})();