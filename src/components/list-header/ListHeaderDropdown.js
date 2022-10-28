import * as React from 'react';
import classnames from 'classnames';

const ListHeaderDropdown = (
  props
) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="dropdown dropdown-action" onBlur={() => setIsOpen(false)}>
      <button
        className="dropdown-click btn btn-primary btn-action font-normal font-weight-bold d-flex align-items-center p-0"
        type="button"
        id="dropdownMenuButton"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <span className="p-2 action-border">
          <span className="pl-1 pr-3">{props.text}</span>
        </span>
        <span className="p-2">
          <i className="icon-caret-down d-flex px-1"></i>
        </span>
      </button>
      <div
        className={classnames({
          'dropdown-menu dropdown-shadow font-sm border-0 w-100': true,
          in: isOpen,
        })}
      >
        {props.actions?.map((action, index) => {
          return (
            <a
              key={index}
              className="dropdown-item px-3 py-2 font-weight-semibold"
              href={action.link || '#'}
              onClick={action.onClick}
            >
              {action.text}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default ListHeaderDropdown;
