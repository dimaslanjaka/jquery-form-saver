# React Form Saver

A React hook and component version of [jquery-form-saver](https://github.com/dimaslanjaka/jquery-form-saver) that automatically saves and restores form values using localStorage.

## Features

- ✅ **Automatic saving** - Form values are saved to localStorage as users type
- ✅ **Automatic restoration** - Values are restored when the component mounts
- ✅ **React hooks support** - Use `useFormSaver` hook for custom implementations
- ✅ **React component** - Use `ReactFormSaver` component to wrap your forms
- ✅ **TypeScript support** - Fully typed for better development experience
- ✅ **Dynamic forms** - Handles dynamically added/removed form elements
- ✅ **All input types** - Supports text, email, password, number, textarea, select, checkbox, radio, etc.
- ✅ **Ignore functionality** - Add `no-save` attribute to exclude specific fields
- ✅ **Debug mode** - Enable logging for development
- ✅ **Custom storage prefix** - Customize localStorage keys
- ✅ **Zero dependencies** - No external dependencies except React

## Installation

```bash
npm install jquery-form-saver
```

## Usage

### Option 1: Using the Hook

```tsx
import React from 'react';
import { useFormSaver } from 'jquery-form-saver/react';

function MyForm() {
  const { formRef, saveForm, restoreForm, clearForm } = useFormSaver({
    debug: true,
    autoSave: true
  });

  return (
    <form ref={formRef}>
      <input type="text" name="username" placeholder="Username" />
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="password" no-save placeholder="Won't be saved" />
      <textarea name="message" placeholder="Message"></textarea>
      <select name="category">
        <option value="">Select Category</option>
        <option value="general">General</option>
        <option value="support">Support</option>
      </select>
      <input type="checkbox" name="subscribe" /> Subscribe
      <input type="radio" name="priority" value="low" /> Low
      <input type="radio" name="priority" value="high" /> High

      <button type="button" onClick={saveForm}>Save Manually</button>
      <button type="button" onClick={clearForm}>Clear Saved</button>
    </form>
  );
}
```

### Option 2: Using the Component

```tsx
import React, { useRef } from 'react';
import { ReactFormSaver, type ReactFormSaverRef } from 'jquery-form-saver/react';

function MyForm() {
  const formSaverRef = useRef<ReactFormSaverRef>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process form submission
    console.log('Form submitted!');

    // Optionally clear saved values after successful submission
    formSaverRef.current?.clearForm();
  };

  return (
    <ReactFormSaver
      ref={formSaverRef}
      debug={true}
      onSave={(element) => console.log('Saved:', element)}
      onRestore={(element) => console.log('Restored:', element)}
    >
      <input type="text" name="username" placeholder="Username" />
      <input type="email" name="email" placeholder="Email" />
      <textarea name="message" placeholder="Message"></textarea>
      <button type="submit" onClick={handleSubmit}>Submit</button>
    </ReactFormSaver>
  );
}
```

## API Reference

### `useFormSaver(options)`

React hook that provides form saving functionality.

#### Parameters

```tsx
interface FormSaverOptions {
  debug?: boolean;           // Enable console logging (default: false)
  storagePrefix?: string;    // Custom localStorage key prefix
  ignoredAttributes?: string[]; // Attributes to ignore (default: ['no-save'])
  autoSave?: boolean;        // Auto-save on input change (default: true)
}
```

#### Returns

```tsx
{
  formRef: RefObject<HTMLFormElement>;     // Ref to attach to your form
  saveForm: () => void;                    // Manually save all form values
  restoreForm: () => void;                 // Manually restore all form values
  clearForm: () => void;                   // Clear all saved form values
  saveElementValue: (element: HTMLElement) => void;    // Save specific element
  restoreElementValue: (element: HTMLElement) => void; // Restore specific element
  clearElementValue: (element: HTMLElement) => void;   // Clear specific element
}
```

### `ReactFormSaver` Component

A React component that wraps your form and provides automatic saving functionality.

#### Props

```tsx
interface ReactFormSaverProps {
  children: React.ReactNode;
  debug?: boolean;
  storagePrefix?: string;
  ignoredAttributes?: string[];
  autoSave?: boolean;
  className?: string;
  onSave?: (element: HTMLElement) => void;     // Callback when element is saved
  onRestore?: (element: HTMLElement) => void;  // Callback when element is restored
}
```

#### Ref Methods

```tsx
interface ReactFormSaverRef {
  saveForm: () => void;
  restoreForm: () => void;
  clearForm: () => void;
  saveElementValue: (element: HTMLElement) => void;
  restoreElementValue: (element: HTMLElement) => void;
  clearElementValue: (element: HTMLElement) => void;
}
```

## Advanced Examples

### Dynamic Forms

The form saver automatically handles dynamically added/removed form elements:

```tsx
function DynamicForm() {
  const { formRef } = useFormSaver();
  const [fields, setFields] = useState([{ id: 1 }]);

  const addField = () => {
    setFields(prev => [...prev, { id: prev.length + 1 }]);
  };

  return (
    <form ref={formRef}>
      {fields.map(field => (
        <input
          key={field.id}
          type="text"
          name={`field${field.id}`}
          placeholder={`Field ${field.id}`}
        />
      ))}
      <button type="button" onClick={addField}>Add Field</button>
    </form>
  );
}
```

### Custom Storage Prefix

Use different storage prefixes for different forms:

```tsx
function UserForm() {
  const { formRef } = useFormSaver({
    storagePrefix: '/user-registration'
  });

  return (
    <form ref={formRef}>
      {/* form elements */}
    </form>
  );
}

function ContactForm() {
  const { formRef } = useFormSaver({
    storagePrefix: '/contact-form'
  });

  return (
    <form ref={formRef}>
      {/* form elements */}
    </form>
  );
}
```

### Ignoring Sensitive Fields

Add `no-save` attribute to exclude sensitive fields like passwords:

```tsx
<form ref={formRef}>
  <input type="text" name="username" />        {/* Will be saved */}
  <input type="password" name="password" no-save /> {/* Won't be saved */}
  <input type="text" name="email" />           {/* Will be saved */}
</form>
```

## Migration from jQuery Version

The React version maintains the same core functionality as the jQuery version:

### jQuery Version
```javascript
// jQuery version
$('form').smartForm();
```

### React Version
```tsx
// React hook version
function MyForm() {
  const { formRef } = useFormSaver();
  return <form ref={formRef}>{/* ... */}</form>;
}

// or React component version
function MyForm() {
  return (
    <ReactFormSaver>
      {/* form elements */}
    </ReactFormSaver>
  );
}
```

## Browser Support

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- All modern browsers with MutationObserver support

## License

MIT License - see the [LICENSE](LICENSE.md) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Issues

Please report issues at [GitHub Issues](https://github.com/dimaslanjaka/jquery-form-saver/issues).
