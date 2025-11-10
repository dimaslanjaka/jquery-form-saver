import React, { useState } from 'react';
import { useFormSaver } from 'jquery-form-saver/react';

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

export default HookExample;
