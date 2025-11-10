import React, { useRef, useState } from 'react';
import { ReactFormSaver, type ReactFormSaverRef } from 'jquery-form-saver/react';

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

export default ComponentExample;
