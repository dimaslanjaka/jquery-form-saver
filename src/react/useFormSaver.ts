import { useEffect, useRef, useCallback } from 'react';

// Helper types
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
export const useFormSaver = (options: FormSaverOptions = {}) => {
  const {
    debug = false,
    storagePrefix = window.location.pathname.replace(/\/$/, '') + '/formField',
    ignoredAttributes = ['no-save'],
    autoSave = true,
    onRestore
  } = options as FormSaverOptions;

  const formRef = useRef<HTMLFormElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  /**
   * Generate unique identifier for form elements
   */
  const generateId = useCallback(() => {
    return Math.random().toString(36).substr(2, 9);
  }, []);

  /**
   * Get unique identifier for form element
   */
  const getElementKey = useCallback((element: FormElement): string => {
    const id = element.id || element.name || element.getAttribute('data-form-id');

    if (!id) {
      const newId = generateId();
      element.setAttribute('data-form-id', newId);
      return `${storagePrefix}${newId}`;
    }

    return `${storagePrefix}${id}`;
  }, [generateId, storagePrefix]);

  /**
   * Check if element should be ignored
   */
  const isIgnored = useCallback((element: FormElement): boolean => {
    return ignoredAttributes.some(attr => element.hasAttribute(attr));
  }, [ignoredAttributes]);

  /**
   * Save form element value to localStorage
   */
  const saveElementValue = useCallback((element: FormElement) => {
    if (isIgnored(element)) return;

    const key = getElementKey(element);
    const type = element.getAttribute('type');

    try {
      if (type === 'checkbox') {
        localStorage.setItem(key, JSON.stringify((element as HTMLInputElement).checked));
        if (debug) console.log(`Saved checkbox ${key}:`, (element as HTMLInputElement).checked);
      } else if (type === 'radio') {
        const name = element.name;
        if (name) {
          const radioElements = document.getElementsByName(name) as NodeListOf<HTMLInputElement>;
          let saved = false;
          for (let i = 0; i < radioElements.length; i++) {
            if (radioElements[i].checked) {
              localStorage.setItem(key, JSON.stringify({ index: i, value: radioElements[i].value }));
              saved = true;
              if (debug) console.log(`Saved radio ${key}:`, { index: i, value: radioElements[i].value });
              break;
            }
          }
          if (!saved) {
            // nothing selected in the group - remove stale saved value
            localStorage.removeItem(key);
            if (debug) console.log(`Removed radio ${key} (no selection)`);
          }
        }
      } else {
        const value = (element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
        if (value !== '') {
          localStorage.setItem(key, value);
          if (debug) console.log(`Saved ${element.tagName.toLowerCase()} ${key}:`, value);
        } else {
          // cleared by user -> remove stored value so restore won't bring back stale data
          localStorage.removeItem(key);
          if (debug) console.log(`Removed ${key} (empty value)`);
        }
      }
    } catch (error) {
      console.error('Error saving form value:', error);
    }
  }, [getElementKey, isIgnored, debug]);

  /**
   * Restore form element value from localStorage
   */
  const restoreElementValue = useCallback((element: FormElement) => {
    // If element is marked ignored (e.g., `no-save`) don't touch it at all.
    // Previously we cleared ignored inputs which could wipe input fields unexpectedly.
    if (isIgnored(element)) {
      return;
    }

    const key = getElementKey(element);
    const type = element.getAttribute('type');

    try {
      if (type === 'checkbox') {
        const saved = localStorage.getItem(key);
        if (saved !== null) {
          const checked = JSON.parse(saved);
          (element as HTMLInputElement).checked = checked;
          if (debug) console.log(`Restored checkbox ${key}:`, checked);
          try {
            onRestore?.(element, checked);
          } catch (err) {
            // ignore onRestore errors
          }
          return checked;
        }
        return null;
      } else if (type === 'radio') {
        const saved = localStorage.getItem(key);
        if (saved !== null) {
          const radioData = JSON.parse(saved);
          const name = element.name;
          if (name && radioData && typeof radioData.index === 'number') {
            const radioElements = document.getElementsByName(name) as NodeListOf<HTMLInputElement>;
            if (radioElements[radioData.index]) {
              radioElements[radioData.index].checked = true;
              if (debug) console.log(`Restored radio ${key}:`, radioData);
              try {
                onRestore?.(element, radioData);
              } catch (err) {
                // ignore onRestore errors
              }
              return radioData;
            }
          }
          return null;
        }
        return null;
      } else {
        const saved = localStorage.getItem(key);
        if (saved !== null) {
          (element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value = saved;
          if (debug) console.log(`Restored ${element.tagName.toLowerCase()} ${key}:`, saved);
          try {
            onRestore?.(element, saved);
          } catch (err) {
            // ignore onRestore errors
          }
          return saved;
        }
        return null;
      }
    } catch (error) {
      console.error('Error restoring form value:', error);
      return null;
    }
  }, [getElementKey, isIgnored, debug]);

  /**
   * Clear saved value for element
   */
  const clearElementValue = useCallback((element: FormElement) => {
    const key = getElementKey(element);
    localStorage.removeItem(key);
    if (debug) console.log(`Cleared ${key}`);
  }, [getElementKey, debug]);

  /**
   * Get all form elements
   */
  const getFormElements = useCallback((): FormElement[] => {
    if (!formRef.current) return [];

    const elements = formRef.current.querySelectorAll('input, textarea, select');
    return Array.from(elements) as FormElement[];
  }, []);

  /**
   * Restore all form values
   */
  const restoreForm = useCallback(() => {
    const elements = getFormElements();
    elements.forEach(restoreElementValue);
  }, [getFormElements, restoreElementValue]);

  /**
   * Save all form values
   */
  const saveForm = useCallback(() => {
    const elements = getFormElements();
    elements.forEach(saveElementValue);
  }, [getFormElements, saveElementValue]);

  /**
   * Clear all saved form values
   */
  const clearForm = useCallback(() => {
    const elements = getFormElements();
    elements.forEach(clearElementValue);
  }, [getFormElements, clearElementValue]);

  /**
   * Handle form element changes
   */
  const handleElementChange = useCallback((event: Event) => {
    const element = event.target as FormElement;
    if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT')) {
      saveElementValue(element);
    }
  }, [saveElementValue]);

  /**
   * Setup event listeners and mutation observer
   */
  useEffect(() => {
    if (!formRef.current || !autoSave) return;

    const form = formRef.current;

    // Add change event listeners
    form.addEventListener('change', handleElementChange);
    form.addEventListener('input', handleElementChange);

    // Setup mutation observer to handle dynamically added elements
    observerRef.current = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;

            // Check if the added element is a form element
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
              restoreElementValue(element as FormElement);
            }

            // Check for form elements within the added element
            const formElements = element.querySelectorAll?.('input, textarea, select');
            if (formElements) {
              formElements.forEach((el) => restoreElementValue(el as FormElement));
            }
          }
        });
      });
    });

    observerRef.current.observe(form, {
      childList: true,
      subtree: true
    });

    // Initial restoration
    restoreForm();

    return () => {
      form.removeEventListener('change', handleElementChange);
      form.removeEventListener('input', handleElementChange);

      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [autoSave, handleElementChange, restoreForm, restoreElementValue]);

  return {
    formRef,
    saveForm,
    restoreForm,
    clearForm,
    saveElementValue,
    restoreElementValue,
    clearElementValue
  };
};

export default useFormSaver;
