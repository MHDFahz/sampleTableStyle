import * as React from 'react';
import classnames from 'classnames';

const SaveFilter = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const save = () => {
    if (!name) {
      return;
    }
    props.onSave(name);
    setName('');
    setIsOpen(false);
  };

  return (
    <div className="dropdown dropdown-save">
      <span
        className="dropdown-click cursor-pointer d-inline-block text-gray-500 text-center text-uppercase font-xxxxs font-weight-semibold py-2 save-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="icon-save font-base d-block mb-1"></i>
        Save
      </span>
      <div
        className={classnames({
          'dropdown-menu dropdown-shadow rounded font-sm border-0 w-100': true,
          in: isOpen,
        })}
      >
        <div className="p-3">
          <h6 className="font-weight-semibold mb-3">Save New filter</h6>
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label className="font-xs text-gray-500">
                  Saved Filter Name
                </label>
                <input
                  type="text"
                  className="form-control font-weight-semibold"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 text-right pt-1">
              <button
                className="btn btn-outline-secondary font-normal font-weight-semibold py-2 px-4 mr-1"
                onClick={() => {
                  setName('');
                  setIsOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                className={classnames({
                  'btn btn-primary font-normal font-weight-semibold py-2 px-4': true,
                  disabled: !name,
                })}
                onClick={save}
                disabled={props.isSaving || !name}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveFilter;
