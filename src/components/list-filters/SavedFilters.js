import * as React from 'react';

const SavedFilters = (props) => {
  if (!props.items?.length) {
    return <></>;
  }
  return (
    <div className="saved-filter px-3">
      <h6 className="text-uppercase font-xxxs text-gray-500 m-0 pt-3">
        Saved Filter
      </h6>
      <ul className="list-unstyled p-0 m-0 font-weight-semibold">
        {props.items?.map((item, index) => {
          return (
            <li
              key={index}
              className="d-flex justify-content-between align-items-center border-bottom py-3 pl-2 cursor-pointer"
            >
              <span onClick={() => props.onSelect?.(item.value)}>
                {item.name}{' '}
              </span>
              {props.onRemove && (
                <span
                  className="icon-bin font-lg cursor-pointer alert-modal"
                  onClick={() => props.onRemove?.(item._id)}
                ></span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SavedFilters;
