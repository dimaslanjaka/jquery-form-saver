import React, { useRef, useState } from 'react';
import { ReactFormSaver, useFormSaver, type ReactFormSaverRef } from 'jquery-form-saver/react';

/**
 * Example 1: Using the ReactFormSaver component
 */
const ComponentExample: React.FC = () => {
  const formSaverRef = useRef<ReactFormSaverRef>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Form submitted! Values will be remembered.');
    // Optionally clear saved values after successful submission
    // formSaverRef.current?.clearForm();
  };

  const handleClear = () => {
    formSaverRef.current?.clearForm();
    setMessage('All saved values cleared!');
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h2 className="card-title mb-0">Component Example</h2>
      </div>
      <div className="card-body">
        <ReactFormSaver
          ref={formSaverRef}
          debug={true}
          className="row g-3"
          onSave={(element) => console.log('Saved:', element)}
          onRestore={(element: HTMLElement, value?: any) => console.log('Restored:', element, 'value:', value)}
        >
          <div className="col-md-6">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              className="form-control"
              placeholder="Enter username"
              autoComplete="off"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="form-control"
              placeholder="Enter email"
              autoComplete="off"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="form-control"
              no-save='true'
              placeholder="This won't be saved"
              autoComplete="off"
            />
            <div className="form-text">This field won't be saved for security reasons.</div>
          </div>

          <div className="col-12">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea
              name="message"
              id="message"
              className="form-control"
              rows={4}
              placeholder="Enter your message"
              autoComplete="off"
            ></textarea>
          </div>

          <div className="col-md-6">
            <label htmlFor="category" className="form-label">Category</label>
            <select name="category" id="category" className="form-select" autoComplete="off">
              <option value="">Select Category</option>
              <option value="general">General</option>
              <option value="support">Support</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>

          <div className="col-12">
            <div className="form-check">
              <input type="checkbox" name="subscribe" id="subscribe" className="form-check-input" autoComplete="off" />
              <label className="form-check-label" htmlFor="subscribe">
                Subscribe to newsletter
              </label>
            </div>
          </div>

          <div className="col-12">
            <label className="form-label">Priority</label>
            <div className="d-flex gap-3">
              <div className="form-check">
                <input type="radio" name="priority" value="low" id="priority-low" className="form-check-input" autoComplete="off" />
                <label className="form-check-label" htmlFor="priority-low">
                  Low
                </label>
              </div>
              <div className="form-check">
                <input type="radio" name="priority" value="medium" id="priority-medium" className="form-check-input" autoComplete="off" />
                <label className="form-check-label" htmlFor="priority-medium">
                  Medium
                </label>
              </div>
              <div className="form-check">
                <input type="radio" name="priority" value="high" id="priority-high" className="form-check-input" autoComplete="off" />
                <label className="form-check-label" htmlFor="priority-high">
                  High
                </label>
              </div>
            </div>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary me-2" onClick={handleSubmit}>
              <i className="bi bi-check-circle me-1"></i>
              Submit
            </button>
            <button type="button" className="btn btn-outline-danger" onClick={handleClear}>
              <i className="bi bi-trash me-1"></i>
              Clear Saved Values
            </button>
          </div>
        </ReactFormSaver>

        {message && (
          <div className="alert alert-success mt-3" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Example 2: Using the useFormSaver hook
 */
const HookExample: React.FC = () => {
  const { formRef, saveForm, restoreForm, clearForm } = useFormSaver({
    debug: true,
    storagePrefix: '/custom-prefix',
    autoSave: true
  });

  const [status, setStatus] = useState('');

  const handleManualSave = () => {
    saveForm();
    setStatus('Form manually saved!');
  };

  const handleRestore = () => {
    restoreForm();
    setStatus('Form values restored!');
  };

  const handleClear = () => {
    clearForm();
    setStatus('Saved values cleared!');
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h2 className="card-title mb-0">Hook Example</h2>
      </div>
      <div className="card-body">
        <form ref={formRef} className="row g-3" autoComplete="off">
          <div className="col-md-6">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              className="form-control"
              placeholder="Enter first name"
              autoComplete="off"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              className="form-control"
              placeholder="Enter last name"
              autoComplete="off"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="age" className="form-label">Age</label>
            <input
              type="number"
              name="age"
              id="age"
              className="form-control"
              min="1"
              max="120"
              placeholder="Enter age"
              autoComplete="off"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="country" className="form-label">Country</label>
            <select name="country" id="country" className="form-select" autoComplete="off">
              <option value="">Select Country</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="ca">Canada</option>
              <option value="au">Australia</option>
              <option value="id">Indonesia</option>
            </select>
          </div>

          <div className="col-12">
            <label htmlFor="bio" className="form-label">Bio</label>
            <textarea
              name="bio"
              id="bio"
              className="form-control"
              rows={3}
              placeholder="Tell us about yourself"
              autoComplete="off"
            ></textarea>
          </div>

          <div className="col-12">
            <div className="form-check">
              <input type="checkbox" name="terms" id="terms" className="form-check-input" autoComplete="off" />
              <label className="form-check-label" htmlFor="terms">
                I agree to the terms and conditions
              </label>
            </div>
          </div>

          <div className="col-12">
            <button type="button" className="btn btn-success me-2" onClick={handleManualSave}>
              <i className="bi bi-floppy me-1"></i>
              Manual Save
            </button>
            <button type="button" className="btn btn-info me-2" onClick={handleRestore}>
              <i className="bi bi-arrow-clockwise me-1"></i>
              Restore
            </button>
            <button type="button" className="btn btn-outline-danger" onClick={handleClear}>
              <i className="bi bi-trash me-1"></i>
              Clear
            </button>
          </div>
        </form>

        {status && (
          <div className="alert alert-info mt-3" role="alert">
            <i className="bi bi-info-circle-fill me-2"></i>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Example 3: Dynamic form elements
 */
const DynamicExample: React.FC = () => {
  const { formRef } = useFormSaver({ debug: true });
  const [fields, setFields] = useState([{ id: 1, value: '' }]);

  const addField = () => {
    setFields(prev => [...prev, { id: prev.length + 1, value: '' }]);
  };

  const removeField = (id: number) => {
    setFields(prev => prev.filter(field => field.id !== id));
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h2 className="card-title mb-0">Dynamic Fields Example</h2>
      </div>
      <div className="card-body">
        <form ref={formRef} className="row g-3" autoComplete="off">
          {fields.map((field) => (
            <div key={field.id} className="col-12">
              <div className="input-group">
                <span className="input-group-text">Field {field.id}</span>
                <input
                  type="text"
                  name={`dynamicField${field.id}`}
                  className="form-control"
                  placeholder={`Enter value for field ${field.id}`}
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => removeField(field.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          ))}

          <div className="col-12">
            <button type="button" className="btn btn-success" onClick={addField}>
              <i className="bi bi-plus-circle me-2"></i>
              Add Field
            </button>
          </div>
        </form>

        <div className="alert alert-info mt-3" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Note:</strong> Dynamically added/removed fields are automatically handled by the mutation observer.
        </div>
      </div>
    </div>
  );
};

/**
 * Main demo component
 */
const ReactFormSaverDemo: React.FC = () => {
  return (
    <div className="container py-5">
      <div className="alert alert-secondary" role="alert">
        <strong>Tip:</strong> Open your browser's developer console to see <code>onSave</code> and <code>onRestore</code> logs when interacting with the demo.
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-3">React Form Saver Demo</h1>
            <p className="lead text-muted">
              This demo shows how to use the React version of jquery-form-saver.
              All form values are automatically saved to localStorage and restored when you refresh the page.
            </p>
          </div>

          <ComponentExample />

          <HookExample />

          <DynamicExample />
        </div>
      </div>
    </div>
  );
};

export default ReactFormSaverDemo;
