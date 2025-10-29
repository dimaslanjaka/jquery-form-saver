import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/react/index.ts'], // entry point for React subpackage
  outDir: 'dist/react', // output folder
  format: ['esm'], // only ESM to avoid default wrapping issues
  tsconfig: 'tsconfig.react.json', // use React-specific tsconfig
  dts: true, // generate .d.ts files
  sourcemap: true,
  clean: true, // clean folder before build
  external: ['react', 'react-dom'], // don't bundle React
  treeshake: false // prevent stripping exports
});
