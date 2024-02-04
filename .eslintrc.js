const prettier = require('./.prettierrc.json');
// or using prettier config javascript
// const prettier = require('./.prettierrc');

/**
 * @type {import('eslint').ESLint.ConfigData}
 */
const config = {
  // Specifies your current project has own eslint rules without extends parent folder eslint rules
  root: true,
  // Specifies the ESLint parser
  parser: '@typescript-eslint/parser',
  env: {
    // add support for browser js (window,document,location,etc)
    browser: true,
    // add amd support
    amd: true,
    // add node support (module.export,etc)
    node: true,
    // add jquery support
    jquery: true
  },
  globals: {
    adsbygoogle: true,
    gtag: true,
    $: true,
    safelink: true,
    google: 'readonly',
    gapi: 'readonly'
  },
  parserOptions: {
    // Allows for the parsing of modern ECMAScript features
    ecmaVersion: 2020,
    // Allows for the use of imports
    sourceType: 'module'
    // strict nested project to be handled
    // project: ['./tsconfig.json'],
  },
  extends: [
    // Uses eslint default recommended rules
    'eslint:recommended',
    // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:@typescript-eslint/eslint-recommended',
    // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:@typescript-eslint/recommended',
    // Enables eslint-plugin-prettier and eslint-config-prettier.
    // This will display prettier errors as ESLint errors.
    // Make sure this is always the last configuration in the extends array.
    'plugin:prettier/recommended'
  ],
  // override rules for js files
  overrides: [
    {
      files: ['*.js'],
      rules: {
        // disable require warning on js files
        '@typescript-eslint/no-var-requires': 'off',
        // disable include refenrences definition files on js
        '@typescript-eslint/triple-slash-reference': 'off'
      }
    }
  ],
  // specify your desired rules for eslint
  rules: {
    'prettier/prettier': ['error', prettier],
    // disable function without boundary return type
    '@typescript-eslint/explicit-function-return-type': 'off',
    // disable original eslint unused-vars
    'no-unused-vars': 'off',
    // enable typescript-eslint unused-vars
    // and allow unused vars start with underscore (_)
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }
    ],
    // allow any types
    '@typescript-eslint/no-explicit-any': 'off',
    // enable this variable calls
    '@typescript-eslint/no-this-alias': [
      'error',
      {
        // Disallow `const { props, state } = this`; true by default
        allowDestructuring: false,
        // Allow `const self = this`; `[]` by default
        allowedNames: ['self']
      }
    ],
    // these ESLint core rules that can cause issues with
    // prettier/prettier plugin, so turn them off.
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    // ESLint performance issues fixes
    // fix eslint-plugin-import
    // * TypeScript provides the same checks as part of standard type checking
    'import/no-named-as-default-member': 'off',
    'import/named': 'off',
    'import/namespace': 'off',
    'import/default': 'off',
    // fix @typescript-eslint
    // * disable the base rule as it can report incorrect errors
    indent: 'off',
    '@typescript-eslint/indent': 'off',
    // fix default eslint rules
    // * disable the Enforce sorted import declarations within modules
    'sort-imports': 'off',
    '@typescript-eslint/triple-slash-reference': 'off'
  }
};

module.exports = config;
