const { build: esbuild } = require('esbuild');
const { copy: fscopy } = require('fs-extra');

const args = process.argv.slice(2);

const has_arg = name => args.includes(name);
const get_arg = name => {
	const index = args.indexOf(name);
	if(index < 0) return;
	if (index >= args.length || args[index + 1].startsWith('-')) {
		process.stdout.write(`\n> Error reading argument \x1b[31m${name}\x1b[0m\n`);
		process.exit(1);
	}
	return args[index + 1];
};

const src_dir = get_arg('-i') || 'src/';
const out_dir = get_arg('-o') || 'dist/';
const sw_path = src_dir + 'sw.js';
const minify  = has_arg('--minify');
const watch   = has_arg('--watch');
const serve   = has_arg('--serve');

const copy_list = [
	'manifest.webmanifest',

	'index.html',
	'simulator.html',
	'lessons',
	'localization',

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
		await Promise.all(copy_list.map(copy));
	})}\x1b[0m ms\n`);

	let bs = (watch || serve) ? require("browser-sync").create() : null;

	if (watch) {
		const { resolve } = require('path');

		const copy_list_paths = copy_list.map(path => resolve(src_dir + path));

		bs.watch(src_dir).on('change', async (path, stats) => {
			process.stdout.write(`[watch] change in \x1b[33m${path}\x1b[0m... `);

			const clean_path = path.replaceAll('\\', '/');
			const full_path = resolve(clean_path);
			if (clean_path === sw_path) {
				time(build_sw)
					.then(t => process.stdout.write(`built sw in \x1b[32m${t}\x1b[0m ms\n`));
			} else if (copy_list_paths.find(path => full_path.startsWith(path))) {
				time(() => copy(clean_path.replace(src_dir, '')))
					.then(t => process.stdout.write(`copied in \x1b[32m${t}\x1b[0m ms\n`));
			} else {
				time(build_main)
					.then(t => process.stdout.write(`built main in \x1b[32m${t}\x1b[0m ms\n`));
			}
		});
	}

	if (serve) {
		bs.init({
			server: out_dir,
			port: 8181,
			// https: true,
			open: false,
			ghostMode: { // mirror interaction across all devices
				clicks: false,
				forms: false,
				scroll: false
			},
			logFileChanges: false,
			logSnippet: false,
			snippet: false,
			// online: false,
			reloadDelay: 100,
			reloadDebounce: 200,
			minify: false,
			ui: false,
			timestamps: false,
		});
	}

})();