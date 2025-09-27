import React, { forwardRef, useImperativeHandle } from 'react';
import { useFormSaver } from './useFormSaver';
import './react-html-attributes';

interface ReactFormSaverProps {
  children: React.ReactNode;
  debug?: boolean;
  storagePrefix?: string;
  ignoredAttributes?: string[];
  autoSave?: boolean;
  className?: string;
  onSave?: (element: HTMLElement) => void;
  onRestore?: (element: HTMLElement) => void;
}

export interface ReactFormSaverRef {
  saveForm: () => void;
  restoreForm: () => void;
  clearForm: () => void;
  saveElementValue: (element: HTMLElement) => void;
  restoreElementValue: (element: HTMLElement) => void;
  clearElementValue: (element: HTMLElement) => void;
}

/**
 * React component version of JqueryFormSaver
 * Wraps form elements and automatically saves/restores their values
 *
 * @example
 * ```tsx
 * import { ReactFormSaver } from 'jquery-form-saver/react';
 *
 * function MyForm() {
 *   const formSaverRef = useRef<ReactFormSaverRef>(null);
 *
 *   return (
 *     <ReactFormSaver ref={formSaverRef} debug={true}>
 *       <form>
 *         <input type="text" name="username" placeholder="Username" />
 *         <input type="email" name="email" placeholder="Email" />
 *         <textarea name="message" placeholder="Message"></textarea>
 *         <select name="category">
 *           <option value="">Select Category</option>
 *           <option value="general">General</option>
 *           <option value="support">Support</option>
 *         </select>
 *         <input type="checkbox" name="subscribe" /> Subscribe to newsletter
 *         <input type="radio" name="priority" value="low" /> Low
 *         <input type="radio" name="priority" value="high" /> High
 *         <button type="submit">Submit</button>
 *       </form>
 *     </ReactFormSaver>
 *   );
 * }
 * ```
 */
export const ReactFormSaver = forwardRef<ReactFormSaverRef, ReactFormSaverProps>(
  (
    {
      children,
      debug = false,
      storagePrefix,
      ignoredAttributes = ['no-save'],
      autoSave = true,
      className,
      onSave,
      onRestore
    },
    ref
  ) => {
    const { formRef, saveForm, restoreForm, clearForm, saveElementValue, restoreElementValue, clearElementValue } =
      useFormSaver({
        debug,
        storagePrefix,
        ignoredAttributes,
        autoSave
      });

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        saveForm,
        restoreForm,
        clearForm,
        saveElementValue: (element: HTMLElement) => {
          saveElementValue(element as any);
          onSave?.(element);
        },
        restoreElementValue: (element: HTMLElement) => {
          restoreElementValue(element as any);
          onRestore?.(element);
        },
        clearElementValue
      }),
      [saveForm, restoreForm, clearForm, saveElementValue, restoreElementValue, clearElementValue, onSave, onRestore]
    );

    return (
      <form ref={formRef} className={className}>
        {children}
      </form>
    );
  }
);

ReactFormSaver.displayName = 'ReactFormSaver';

export default ReactFormSaver;
