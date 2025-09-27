/**
 * React version of jquery-form-saver
 *
 * This package provides React hooks and components that replicate the functionality
 * of the original jQuery-based form saver, allowing automatic saving and restoration
 * of form values using localStorage.
 */

// Import type extensions for HTML attributes
import './react-html-attributes';

export { useFormSaver } from './useFormSaver';
export { ReactFormSaver, type ReactFormSaverRef } from './ReactFormSaver';

// For backward compatibility, also export as default
export { useFormSaver as default } from './useFormSaver';
