import * as React from 'react';

const ListHeaderSearch = React.memo(
  (props) => {
    const [search, setSearch] = React.useState(props.serachTerm || '');

    React.useEffect(() => {
      setSearch(props.serachTerm || '');
    }, [props.serachTerm]);

    const onSubmit = (e) => {
      e.preventDefault();
      props.onSearch?.(search);
    };

    return (
      <div className="filter-search">
        <form onSubmit={onSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control border-0 pr-0"
              placeholder={props.placeholder || 'Search'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="input-group-append d-flex w-auto">
              {search.length > 0 && (
                <span
                  className="btn btn-link border-0 bg-transparent px-2 py-0"
                  onClick={() => {
                    setSearch('');
                    props.onSearch?.('');
                  }}
                >
                  <i className="icon-close position-absolute align-xy-center font-weight-bold font-xxxs text-gray-400"></i>
                </span>
              )}
              <span
                onClick={() => props.onSearch?.(search)}
                className="form-control-search btn btn-link border-0 bg-transparent px-3 py-0"
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
);

export default ListHeaderSearch;
