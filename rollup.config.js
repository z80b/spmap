import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';
import vue from 'rollup-plugin-vue';
import esbuild from 'rollup-plugin-esbuild';
import filesize from 'rollup-plugin-filesize';
import requireContext from 'rollup-plugin-require-context';
import { visualizer } from 'rollup-plugin-visualizer';
import scriptSetup from 'unplugin-vue2-script-setup/rollup';

const production = !process.env.ROLLUP_WATCH;
const port = 3000;
const plugins = [
  json(),
  alias({
    entries: [{ find: '@', replacement: __dirname + '/src/' }],
  }),
  image(),
  postcss({
    extract: 'spmap.css',
    config: { path: 'postcss.config.js' },
  }),
  requireContext(),
  nodeResolve({
    jsnext: true,
    main: true,
    browser: true,
  }),
  commonjs(),
  scriptSetup(),
  vue({
    css: false,
    needMap: false,
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.includes('-'),
      },
    },
    style: {
      postcssModulesOptions: {
        generateScopedName: '[name]-[hash:base64:4]',
      },
    },
  }),
  replace({
    'process.env.NODE_ENV': production ? '"production"' : '"development"',
    preventAssignment: true,
  }),
  esbuild({
    minify: production,
    target: 'es2015',
  }),
  !production &&
    visualizer({
      open: false,
    }),
  production && filesize(),
];

export default [{
  input: 'src/map-viewer.js',
  output: {
    dir: './sites/all/modules/spmap/static',
    entryFileNames: 'spmap-viewer.js',
    format: 'iife',
    sourcemap: !production ? 'inline' : false,
    name: 'app',
  },
  plugins,
  watch: {
    clearScreen: true,
  },
}, {
  input: 'src/map-editor.js',
  output: {
    dir: './sites/all/modules/spmap/static',
    entryFileNames: 'spmap-editor.js',
    format: 'iife',
    sourcemap: !production ? 'inline' : false,
    name: 'app',
  },
  plugins,
  watch: {
    clearScreen: true,
  },
}]
