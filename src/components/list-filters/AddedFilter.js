import * as React from 'react';


const AddedFilter = (props) => {
  return (
    <li className="col-auto filter-choice py-1">
      <div className="font-xs bg-primary rounded-lg text-white text-nowrap font-weight-semibold d-flex align-items-center p-2">
        <span className="filter-hd px-1">{props.name}: </span>
        <span className="cursor-pointer" onClick={props.onClick}>
          {props.valueLabel}
        </span>
        <span
          className="filter-choice-delete icon-close-round font-base pl-2 cursor-pointer"
          onClick={props.onRemove}
        ></span>
      </div>
    </li>
  );
};

export default AddedFilter;
