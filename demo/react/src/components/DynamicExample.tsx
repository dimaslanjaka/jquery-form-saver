import React, { useState } from 'react';
import { useFormSaver } from 'jquery-form-saver/react';

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

export default DynamicExample;
