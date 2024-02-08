const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const terser = require('@rollup/plugin-terser');
const json = require('@rollup/plugin-json');
const typescript = require('@rollup/plugin-typescript');
const path = require('path');
const bundleSize = require('rollup-plugin-bundle-size');
const { babel } = require('@rollup/plugin-babel');
const autoExternal = require('rollup-plugin-auto-external');
const tsconfigBuild = require('./tsconfig.build.json');

const lib = require('./package.json');
const outputFileName = 'JqueryFormSaver';
const name = 'JqueryFormSaver';
const namedInput = './src/js/JqueryFormSaver.ts';
const defaultInput = './src/js/JqueryFormSaver.ts';

const buildConfig = ({ es5, browser = true, minifiedVersion = true, ...config }) => {
  const { file } = config.output;
  const ext = path.extname(file);
  const basename = path.basename(file, ext);
  const extArr = ext.split('.');
  extArr.shift();

  const build = ({ minified }) => ({
    input: namedInput,
    ...config,
    output: {
      ...config.output,
      file: `${path.dirname(file)}/${basename}.${(minified ? ['min', ...extArr] : extArr).join('.')}`
    },
    plugins: [
      typescript.default({ compilerOptions: tsconfigBuild.compilerOptions }),
      json(),
      resolve({ browser }),
      commonjs(),
      minified && terser(),
      minified && bundleSize(),
      ...(es5
        ? [
            babel({
              babelHelpers: 'bundled',
              presets: ['@babel/preset-env']
            })
          ]
        : []),
      ...(config.plugins || [])
    ]
  });

  const configs = [build({ minified: false })];

  if (minifiedVersion) {
    configs.push(build({ minified: true }));
  }

  return configs;
};

const fun = async () => {
  const year = new Date().getFullYear();
  const banner = `// SmartForm v${lib.version} Copyright (c) ${year} ${lib.author} and contributors`;

  return [
    // bundle release
    ...buildConfig({
      input: './src/js/main.ts',
      minifiedVersion: true,
      es5: true,
      output: {
        file: 'dist/release/bundle.js',
        format: 'umd',
        exports: 'default',
        banner,
        name: 'formsaver'
      },
      plugins: [
        typescript.default({ compilerOptions: { ...tsconfigBuild.compilerOptions, declaration: false } }),
        resolve(),
        commonjs()
      ]
    }),

    // bundle autosave.js
    ...buildConfig({
      input: './src/js/autosave.ts',
      minifiedVersion: true,
      es5: true,
      output: {
        file: 'dist/release/autosave.js',
        format: 'iife',
        // exports: 'default',
        banner
        // name: 'formsaver'
      },
      plugins: [
        typescript.default({ compilerOptions: { ...tsconfigBuild.compilerOptions, declaration: false } }),
        resolve(),
        commonjs()
      ]
    }),

    // browser ESM bundle for CDN
    ...buildConfig({
      input: namedInput,
      output: {
        file: `dist/esm/${outputFileName}.js`,
        format: 'esm',
        preferConst: true,
        exports: 'named',
        banner
      }
    }),

    // Browser UMD bundle for CDN
    ...buildConfig({
      input: defaultInput,
      es5: true,
      output: {
        file: `dist/${outputFileName}.js`,
        name,
        format: 'umd',
        exports: 'default',
        banner
      }
    }),

    // Browser CJS bundle
    ...buildConfig({
      input: defaultInput,
      es5: false,
      minifiedVersion: false,
      output: {
        file: `dist/browser/${name}.cjs`,
        name,
        format: 'cjs',
        exports: 'default',
        banner
      }
    }),

    // Node.js commonjs bundle
    {
      input: defaultInput,
      output: {
        file: `dist/node/${name}.cjs`,
        format: 'cjs',
        preferConst: true,
        exports: 'default',
        banner
      },
      plugins: [
        typescript.default({ compilerOptions: tsconfigBuild.compilerOptions }),
        autoExternal(),
        resolve(),
        commonjs()
      ]
    }
  ];
};

module.exports = fun;
