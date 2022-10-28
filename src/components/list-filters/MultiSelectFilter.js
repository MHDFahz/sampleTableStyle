import * as React from 'react';

const MultiSelectFilter = (
  props
) => {
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState(
    props.value || []
  );

  React.useEffect(() => {
    setSelected(props.value || []);
  }, [props.value]);

  const onSelect = (value, sel) => {
    if (sel) {
      setSelected([...(selected || []), value]);
    } else {
      setSelected(selected?.filter((val) => val.value !== value.value) || []);
    }
  };

  const onAllSelected = (isSelected) => {
    const allValues = !isSelected
      ? []
      : filteredOptions?.map((ff) => {
          return {
            label: ff[props.labelField],
            value: ff[props.valueField],
          };
        });

    setSelected(allValues);
  };

  const onApply = () => {
    setSearch('');
    props.applyFilter?.(selected);
  };

  const onClose = () => {
    setSearch('');
    props.onClose?.();
  };

  let filteredOptions;

  if (props.anotherSearchKey) {
    filteredOptions = search
      ? props.options?.filter(
          (op) =>
            op[props.anotherSearchKey]?.match(new RegExp(search, 'i')) ||
            op[props.labelField]?.match(new RegExp(search, 'i')) ||
            op[props.valueField]?.match(new RegExp(search, 'i'))
        )
      : props.options;
  } else {
    filteredOptions = search
      ? props.options?.filter(
          (op) =>
            op[props.labelField]?.match(new RegExp(search, 'i')) ||
            op[props.valueField]?.match(new RegExp(search, 'i'))
        )
      : props.options;
  }

  return (
    <>
      <div className="pb-3">
        <div className="d-flex align-items-center justify-content-between bg-primary px-3 py-2 text-white">
          <h6 className="m-0 font-xs font-weight-semibold">{props.label}</h6>
          <span
            className="cursor-pointer d-inline-block text-center rounded-circle sub-dropdown-back ml-3"
            onClick={onClose}
          >
            <i className="icon-close font-xxs"></i>
          </span>
        </div>
        {props.allowSearch && (
          <div className="search">
            <div className="input-group border-bottom">
              <input
                type="text"
                className="form-control border-0 pr-0"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="input-group-append">
                <span className="form-control-search btn btn-link border-0 bg-transparent px-3 py-0" />
              </div>
            </div>
          </div>
        )}
        <ul className="list-unstyled p-2 m-0 pl-0 ">
          {!!filteredOptions?.length && (
            <li key="all-0" className="py-2 pl-2 pb-3 border-bottom">
              <input
                type="checkbox"
                id={`all-${props.label}`}
                onChange={(e) => onAllSelected(e.target.checked)}
                checked={
                  !filteredOptions.find(
                    (ff) =>
                      !selected.find(
                        (fff) => ff[props.valueField] === fff.value
                      )
                  )
                }
              />
              <label
                htmlFor={`all-${props.label}`}
                className="font-xs font-weight-semibold"
              >
                {`All ${props.label}`}
              </label>
            </li>
          )}
          {filteredOptions?.map((option, index) => {
            const label = option[props.labelField];
            const value = option[props.valueField];
            // if (!value) {
            //   return <></>;
            // }
            const id = `${label}-${value}-${index}`;
            return (
              <li key={index} className="py-2 pl-2 ">
                <input
                  type="checkbox"
                  id={id}
                  onChange={(e) => onSelect({ label, value }, e.target.checked)}
                  checked={!!selected?.find((fv) => fv.value === value)}
                />
                <label htmlFor={id} className="font-xs font-weight-semibold">
                  {label}
                </label>
              </li>
            );
          })}
        </ul>
        <div className="px-3 text-right">
          <button
            type="button"
            className="btn btn-primary py-2 px-4 font-weight-semibold"
            onClick={onApply}
            disabled={!selected?.length}
          >
            <span className="px-2">Apply</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MultiSelectFilter;
