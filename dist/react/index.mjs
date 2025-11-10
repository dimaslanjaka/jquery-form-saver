// src/react/useFormSaver.ts
import { useEffect, useRef, useCallback } from "react";
var useFormSaver = (options = {}) => {
  const {
    debug = false,
    storagePrefix = window.location.pathname.replace(/\/$/, "") + "/formField",
    ignoredAttributes = ["no-save"],
    autoSave = true
  } = options;
  const formRef = useRef(null);
  const observerRef = useRef(null);
  const generateId = useCallback(() => {
    return Math.random().toString(36).substr(2, 9);
  }, []);
  const getElementKey = useCallback((element) => {
    const id = element.id || element.name || element.getAttribute("data-form-id");
    if (!id) {
      const newId = generateId();
      element.setAttribute("data-form-id", newId);
      return `${storagePrefix}${newId}`;
    }
    return `${storagePrefix}${id}`;
  }, [generateId, storagePrefix]);
  const isIgnored = useCallback((element) => {
    return ignoredAttributes.some((attr) => element.hasAttribute(attr));
  }, [ignoredAttributes]);
  const saveElementValue = useCallback((element) => {
    if (isIgnored(element)) return;
    const key = getElementKey(element);
    const type = element.getAttribute("type");
    try {
      if (type === "checkbox") {
        localStorage.setItem(key, JSON.stringify(element.checked));
        if (debug) console.log(`Saved checkbox ${key}:`, element.checked);
      } else if (type === "radio") {
        const name = element.name;
        if (name) {
          const radioElements = document.getElementsByName(name);
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
            localStorage.removeItem(key);
            if (debug) console.log(`Removed radio ${key} (no selection)`);
          }
        }
      } else {
        const value = element.value;
        if (value !== "") {
          localStorage.setItem(key, value);
          if (debug) console.log(`Saved ${element.tagName.toLowerCase()} ${key}:`, value);
        } else {
          localStorage.removeItem(key);
          if (debug) console.log(`Removed ${key} (empty value)`);
        }
      }
    } catch (error) {
      console.error("Error saving form value:", error);
    }
  }, [getElementKey, isIgnored, debug]);
  const restoreElementValue = useCallback((element) => {
    if (isIgnored(element)) {
      return;
    }
    const key = getElementKey(element);
    const type = element.getAttribute("type");
    try {
      if (type === "checkbox") {
        const saved = localStorage.getItem(key);
        if (saved !== null) {
          const checked = JSON.parse(saved);
          element.checked = checked;
          if (debug) console.log(`Restored checkbox ${key}:`, checked);
        }
      } else if (type === "radio") {
        const saved = localStorage.getItem(key);
        if (saved !== null) {
          const radioData = JSON.parse(saved);
          const name = element.name;
          if (name && radioData && typeof radioData.index === "number") {
            const radioElements = document.getElementsByName(name);
            if (radioElements[radioData.index]) {
              radioElements[radioData.index].checked = true;
              if (debug) console.log(`Restored radio ${key}:`, radioData);
            }
          }
        }
      } else {
        const saved = localStorage.getItem(key);
        if (saved !== null) {
          element.value = saved;
          if (debug) console.log(`Restored ${element.tagName.toLowerCase()} ${key}:`, saved);
        }
      }
    } catch (error) {
      console.error("Error restoring form value:", error);
    }
  }, [getElementKey, isIgnored, debug]);
  const clearElementValue = useCallback((element) => {
    const key = getElementKey(element);
    localStorage.removeItem(key);
    if (debug) console.log(`Cleared ${key}`);
  }, [getElementKey, debug]);
  const getFormElements = useCallback(() => {
    if (!formRef.current) return [];
    const elements = formRef.current.querySelectorAll("input, textarea, select");
    return Array.from(elements);
  }, []);
  const restoreForm = useCallback(() => {
    const elements = getFormElements();
    elements.forEach(restoreElementValue);
  }, [getFormElements, restoreElementValue]);
  const saveForm = useCallback(() => {
    const elements = getFormElements();
    elements.forEach(saveElementValue);
  }, [getFormElements, saveElementValue]);
  const clearForm = useCallback(() => {
    const elements = getFormElements();
    elements.forEach(clearElementValue);
  }, [getFormElements, clearElementValue]);
  const handleElementChange = useCallback((event) => {
    const element = event.target;
    if (element && (element.tagName === "INPUT" || element.tagName === "TEXTAREA" || element.tagName === "SELECT")) {
      saveElementValue(element);
    }
  }, [saveElementValue]);
  useEffect(() => {
    if (!formRef.current || !autoSave) return;
    const form = formRef.current;
    form.addEventListener("change", handleElementChange);
    form.addEventListener("input", handleElementChange);
    observerRef.current = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node;
            if (element.tagName === "INPUT" || element.tagName === "TEXTAREA" || element.tagName === "SELECT") {
              restoreElementValue(element);
            }
            const formElements = element.querySelectorAll?.("input, textarea, select");
            if (formElements) {
              formElements.forEach((el) => restoreElementValue(el));
            }
          }
        });
      });
    });
    observerRef.current.observe(form, {
      childList: true,
      subtree: true
    });
    restoreForm();
    return () => {
      form.removeEventListener("change", handleElementChange);
      form.removeEventListener("input", handleElementChange);
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

// src/react/ReactFormSaver.tsx
import { forwardRef, useImperativeHandle } from "react";
import { jsx } from "react/jsx-runtime";
var ReactFormSaver = forwardRef(
  ({
    children,
    debug = false,
    storagePrefix,
    ignoredAttributes = ["no-save"],
    autoSave = true,
    className,
    onSubmit,
    onSave,
    onRestore
  }, ref) => {
    const { formRef, saveForm, restoreForm, clearForm, saveElementValue, restoreElementValue, clearElementValue } = useFormSaver({
      debug,
      storagePrefix,
      ignoredAttributes,
      autoSave
    });
    useImperativeHandle(
      ref,
      () => ({
        saveForm,
        restoreForm,
        clearForm,
        saveElementValue: (element) => {
          saveElementValue(element);
          onSave?.(element);
        },
        restoreElementValue: (element) => {
          restoreElementValue(element);
          onRestore?.(element);
        },
        clearElementValue
      }),
      [saveForm, restoreForm, clearForm, saveElementValue, restoreElementValue, clearElementValue, onSave, onRestore, onSubmit]
    );
    const handleSubmit = (e) => {
      try {
        saveForm();
      } catch (err) {
      }
      try {
        e.preventDefault();
      } catch (err) {
      }
      if (typeof onSubmit === "function") {
        onSubmit(e);
      }
    };
    return /* @__PURE__ */ jsx("form", { ref: formRef, className, onSubmit: handleSubmit, onReset: clearForm, children });
  }
);
ReactFormSaver.displayName = "ReactFormSaver";

// src/react/index.ts
var index_default = useFormSaver;
export {
  ReactFormSaver,
  index_default as default,
  useFormSaver
};
//# sourceMappingURL=index.mjs.map