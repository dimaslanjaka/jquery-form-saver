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
 * React component version of JqueryFormSaver.
 *
 * Wraps form elements and automatically saves/restores their values to
 * web storage (localStorage) using an optional `storagePrefix` key.
 *
 * Usage notes:
 * - Inputs must have a `name` attribute to be saved/restored.
 * - The component restores values into the DOM. If you use controlled React
 *   inputs (value + onChange) you should synchronize the restored DOM value
 *   back into React state after calling `restoreForm()` (see example).
 * - Use the `ignoredAttributes` prop or the `no-save` attribute on an input to
 *   exclude fields (for example OTP codes) from being stored.
 *
 * Examples:
 *
 * 1) Basic usage (uncontrolled inputs or inputs you don't need to sync into state):
 *
 * ```tsx
 * import React, { useRef } from 'react';
 * import { ReactFormSaver, ReactFormSaverRef } from 'jquery-form-saver/react';
 *
 * function ContactForm() {
 *   const ref = useRef<ReactFormSaverRef | null>(null);
 *   return (
 *     <ReactFormSaver ref={ref} storagePrefix="contact-form">
 *       <input name="email" type="email" placeholder="Email" />
 *       <textarea name="message" placeholder="Message" />
 *     </ReactFormSaver>
 *   );
 * }
 * ```
 *
 * 2) Controlled inputs — restore into React state after restore:
 *
 * ```tsx
 * import React, { useRef, useEffect, useState } from 'react';
 * import { ReactFormSaver, ReactFormSaverRef } from 'jquery-form-saver/react';
 *
 * function LoginForm() {
 *   const ref = useRef<ReactFormSaverRef | null>(null);
 *   const [phone, setPhone] = useState('');
 *
 *   useEffect(() => {
 *     // restore DOM values first
 *     ref.current?.restoreForm();
 *     // then sync DOM -> state for controlled inputs
 *     const el = document.querySelector<HTMLInputElement>("input[name='phone']");
 *     if (el?.value) setPhone(el.value);
 *   }, []);
 *
 *   return (
 *     <ReactFormSaver ref={ref} storagePrefix="login">
 *       <input name="phone" value={phone} onChange={e => setPhone(e.target.value)} />
 *     </ReactFormSaver>
 *   );
 * }
 * ```
 *
 * 3) Ignoring OTP fields (do not persist):
 *
 * ```tsx
 * <ReactFormSaver ignoredAttributes={['no-save']}>
 *   <input name="im3_phone" />
 *   <input name="im3_otp" no-save="true" />
 * </ReactFormSaver>
 * ```
 *
 * Methods exposed on the forwarded ref:
 * - `saveForm()` — save current form state
 * - `restoreForm()` — restore saved state into DOM
 * - `clearForm()` — clear saved entries
 * - `saveElementValue(elem)` / `restoreElementValue(elem)` / `clearElementValue(elem)`
 *
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
