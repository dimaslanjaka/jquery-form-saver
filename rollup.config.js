// import resolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
// import { terser } from 'rollup-plugin-terser';
// import json from '@rollup/plugin-json';
// import typescript from '@rollup/plugin-typescript';

const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const terser = require('@rollup/plugin-terser');
const json = require('@rollup/plugin-json');
const typescript = require('@rollup/plugin-typescript');

const lib = require('./package.json');
const outputFileName = 'form-saver';
const name = 'jquery-form-saver';
const input = './src/js/formSaver2.ts';

const buildConfig = config => {
  const build = ({ minified }) => ({
    input,
    ...config,
    output: {
      ...config.output,
      file: `${config.output.file}.${minified ? 'min.js' : 'js'}`
    },
    plugins: [
      typescript(),
      json(),
      resolve({ browser: true }),
      commonjs(),
      minified && terser(),
      ...(config.plugins || [])
    ]
  });

  return [build({ minified: false }), build({ minified: true })];
};

const fun = async () => {
  const year = new Date().getFullYear();
  const banner = `// ${lib.name} v${lib.version} Copyright (c) ${year} ${lib.author}`;

  return [
    ...buildConfig({
      output: {
        file: `dist/${outputFileName}`,
        name,
        format: 'umd',
        exports: 'default',
        banner
      }
    }),

    ...buildConfig({
      output: {
        file: `dist/esm/${outputFileName}`,
        format: 'esm',
        preferConst: true,
        exports: 'named',
        banner
      }
    })
  ];
};

module.exports = fun;
