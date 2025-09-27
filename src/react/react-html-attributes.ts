// Extend React HTML attributes to support custom no-save attribute
import 'react';

declare module 'react' {
  interface HTMLAttributes<T> {
    'no-save'?: boolean | string;
  }
}
