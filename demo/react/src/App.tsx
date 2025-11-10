import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import ComponentExample from './components/ComponentExample';
import HookExample from './components/HookExample';
import DynamicExample from './components/DynamicExample';

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
          <div className="mb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
              <div className="text-md-start text-center">
                <h1 className="h3 fw-bold text-primary mb-1">React Form Saver Demo</h1>
                <p className="small text-muted mb-0">
                  This demo shows how to use the React version of jquery-form-saver. All form values are automatically saved to localStorage and restored when you refresh the page.
                </p>
              </div>

              <nav className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto mt-2 mt-md-0">
                <Link to="/example" className="btn btn-outline-primary w-100 w-sm-auto">Component</Link>
                <Link to="/hook" className="btn btn-outline-primary w-100 w-sm-auto">Hook</Link>
                <Link to="/dynamic" className="btn btn-outline-primary w-100 w-sm-auto">Dynamic</Link>
              </nav>
            </div>
          </div>

          <Routes>
            <Route path="/" element={<ComponentExample />} />
            <Route path="/example" element={<ComponentExample />} />
            <Route path="/hook" element={<HookExample />} />
            <Route path="/dynamic" element={<DynamicExample />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ReactFormSaverDemo;
