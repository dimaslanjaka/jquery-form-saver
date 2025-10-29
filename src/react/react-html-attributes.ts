// Augment React HTML attributes to allow `no-save` custom attribute used by form saver.
// This file is intentionally imported (see ReactFormSaver.tsx) so the augmentation
// is included in projects that import the package source directly.

declare module 'react' {
  // Add custom attribute `no-save` to standard HTML attributes so JSX accepts <input no-save />
  interface HTMLAttributes<T> {
    'no-save'?: string | boolean;
  }
}

export {};
