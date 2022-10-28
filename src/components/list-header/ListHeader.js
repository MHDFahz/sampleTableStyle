import * as React from 'react';

const ListHeader = (props) => {
  return (
    <div className="list-head">
      <div className="px-lg-4 px-3 py-2 border-bottom">
        <div className="row align-items-center py-1">
          <div className="col-lg-4 col-md-4 col-12">{props.children}</div>
          {props.actions != null && props.actions?.length > 0 && (
            <div className="col-lg-8 col-md-8 col-12">
              <div className="row gutter-12 align-items-center justify-content-end">
                {props.actions?.map((action, index) => {
                  return (
                    <div className="col-auto" key={index}>
                      {action}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {props.additionalRows}
    </div>
  );
};

export default ListHeader;
