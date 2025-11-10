import * as React from 'react';
import React__default from 'react';

declare module 'react' {
    interface HTMLAttributes<T> {
        'no-save'?: string | boolean;
    }
}

interface FormElement extends HTMLElement {
    value?: string;
    checked?: boolean;
    name?: string;
    type?: string;
    tagName: string;
}
interface FormSaverOptions {
    debug?: boolean;
    storagePrefix?: string;
    ignoredAttributes?: string[];
    autoSave?: boolean;
    onRestore?: (element: FormElement, value?: any) => void;
}
/**
 * React hook version of JqueryFormSaver
 * Automatically saves and restores form values using localStorage
 */
declare const useFormSaver: (options?: FormSaverOptions) => {
    formRef: React.RefObject<HTMLFormElement>;
    saveForm: () => void;
    restoreForm: () => void;
    clearForm: () => void;
    saveElementValue: (element: FormElement) => void;
    restoreElementValue: (element: FormElement) => any;
    clearElementValue: (element: FormElement) => void;
};

interface ReactFormSaverProps {
    children: React__default.ReactNode;
    debug?: boolean;
    storagePrefix?: string;
    ignoredAttributes?: string[];
    autoSave?: boolean;
    className?: string;
    onSubmit?: (event: React__default.FormEvent<HTMLFormElement>) => void;
    onSave?: (element: HTMLElement) => void;
    onRestore?: (element: HTMLElement, value?: any) => void;
}
interface ReactFormSaverRef {
    saveForm: () => void;
    restoreForm: () => void;
    clearForm: () => void;
    saveElementValue: (element: HTMLElement) => void;
    restoreElementValue: (element: HTMLElement) => any;
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
 * onSubmit behavior:
 * - If `onSubmit` is provided, the component will intercept the form submit event,
 *   call `saveForm()` to persist values, prevent default browser submission, and
 *   then call the provided `onSubmit` callback with the submit event.
 * - This ensures controlled components can persist DOM values before the
 *   consumer handles the submit logic (e.g., API calls).
 *
 */
declare const ReactFormSaver: React__default.ForwardRefExoticComponent<ReactFormSaverProps & React__default.RefAttributes<ReactFormSaverRef>>;

/**
 * React version of jquery-form-saver
 *
 * This package provides React hooks and components that replicate the functionality
 * of the original jQuery-based form saver, allowing automatic saving and restoration
 * of form values using localStorage.
 */

export { ReactFormSaver, type ReactFormSaverRef, useFormSaver as default, useFormSaver };
