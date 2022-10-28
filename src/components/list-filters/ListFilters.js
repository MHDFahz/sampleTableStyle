import * as React from 'react';
import AddedFilter from './AddedFilter';
import SavedFilters from './SavedFilters';
import classnames from 'classnames';
import SaveFilter from './SaveFilter';
import { useOutsideClick } from '../../hooks/useOutsideClick';

export const ListFilters = (
  props
) => {
  const canSaveFilter = true;
  const canRemoveFilter = true;
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const ref = React.useRef(null);
  const filterRef = React.useRef(null);

  const [selectedFilter, setSelectedFilter] = React.useState();
  const [filters, setFilters] = React.useState({
    ...props.filters,
  });

  useOutsideClick(ref, () => {
    setIsOpen(false);
    setSearch('');
    setSelectedFilter(undefined);
  });

  React.useEffect(() => {
    setFilters({ ...props.filters });
  }, [props.filters]);

  const setFilterValue = (key, value) => {
    if (!value) {
      resetFilterValue(key);
    } else {
      const newFilters = {
        ...filters,
        [key]: value,
      };
      setFilters(newFilters);
      setIsOpen(false);
      setSelectedFilter(undefined);
      props.onFilter?.(newFilters);
    }
  };

  const resetFilterValue = (key) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    setIsOpen(false);
    setSelectedFilter(undefined);
    props.onFilter?.(newFilters);
  };

  const resetFilters = (val) => {
    const newFilters = { ...val };
    setFilters(newFilters);
    setIsOpen(false);
    setSelectedFilter(undefined);
    props.onFilter?.(newFilters);
  };

  const allFilters = React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      return child;
    }
  })?.filter((child) => !!child);

  if (!allFilters?.length) {
    return <></>;
  }

  const childFilters = search
    ? allFilters.filter((child) =>
        child.props.label?.match(new RegExp(search, 'i'))
      )
    : allFilters;

  const appliedFiltersCount = Object.keys(filters).reduce(
    (count, filterKey) => {
      if (!filterKey) {
        return count;
      }
      const filterValue = filters[filterKey];
      if (!filterValue) {
        return count;
      }
      if (Array.isArray(filterValue)) {
        return count + filterValue.length;
      } else {
        return count + 1;
      }
    },
    0
  );

  const renderHeader = () => (
    <div className="text-primary font-xs d-flex align-items-center mr-3 py-3">
      <i className="icon-filter font-sm"></i>
      <span className="ml-2">
        Filter:
        <span className="font-weight-bold text-uppercase ml-1">All</span>
      </span>
    </div>
  );

  const getAddedFilters = () => {
    const adFilters = [];
    Object.keys(filters).forEach((filterKey) => {
      const matchingFilter = childFilters.find(
        (child) => child.props.filterKey === filterKey
      );
      if (!filterKey || props.ignoreAddedFilters?.includes(filterKey)) {
        return <></>;
      }
      const filterValue = filters[filterKey];
      if (!filterValue || matchingFilter?.props?.fixed) {
        return <></>;
      }
      if (Array.isArray(filterValue)) {
        let filterValues = filterValue
          ?.map((f) => f.label)
          ?.slice(0, 2)
          ?.join(', ');
        if (filterValue.length > 2) {
          filterValues = `${filterValues}, + ${filterValue.length - 2} more`;
        }

        adFilters.push(
          <AddedFilter
            key={`filter-${filterKey}-${filterValues}`}
            name={matchingFilter?.props?.label || 'Filter'}
            valueLabel={filterValues}
            onRemove={() => resetFilterValue(filterKey)}
            onClick={() => {
              setIsOpen(true);
              setSelectedFilter(filterKey);
              filterRef?.current?.scrollIntoView();
            }}
          />
        );
      } else {
        adFilters.push(
          <AddedFilter
            name={matchingFilter?.props?.label || 'Filter'}
            valueLabel={filterValue.label}
            onRemove={() => resetFilterValue(filterKey)}
            onClick={() => {
              setIsOpen(true);
              setSelectedFilter(filterKey);
              filterRef?.current?.scrollIntoView();
            }}
          />
        );
      }
    });

    return adFilters;
  };

  const renderFixedFilters = () => {
    return childFilters.map((child, index) => {
      const childProps = child.props;
      if (!childProps.fixed) {
        return <></>;
      }

      return React.cloneElement(child, {
        ...childProps,
        applyFilter: (value) =>
          setFilterValue(childProps.filterKey, value),
        resetFilter: () => resetFilterValue(childProps.filterKey),
        onClose: () => setSelectedFilter(undefined),
        value: filters[childProps.filterKey],
      });
    });
  };

  const renderSearch = () => {
    return (
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
            <span className="form-control-search btn btn-link border-0 bg-transparent px-4 py-0" />
          </div>
        </div>
      </div>
    );
  };

  const renderFilterSaveOptions = () => {
    if (!appliedFiltersCount) {
      return <></>;
    }
    return (
      <div className="row gutter-8">
        {props.onSaveFilter && canSaveFilter && (
          <div className="col-auto">
            <SaveFilter
              onSave={props.onSaveFilter}
              isSaving={props.isSavingFilter}
            />
          </div>
        )}
        {canRemoveFilter && (
          <div className="col-auto">
            <span
              className="cursor-pointer d-inline-block text-gray-500 text-center text-uppercase font-xxxxs font-weight-semibold py-2"
              onClick={() => resetFilters({})}
            >
              <i className="icon-reset font-base d-block mb-1"></i>
              Reset
            </span>
          </div>
        )}
      </div>
    );
  };

  const addedFilters = getAddedFilters();

  const hasFixedFilters =
    childFilters.filter((child, index) => {
      const childProps = child.props;
      return childProps.fixed && filters[childProps.filterKey];
    }).length > 0;

  const hasAddedFilters = addedFilters.length > 0;

  return (
    <div
      className={classnames({
        'px-lg-4 px-3 filter-blk': true,
        'filter-selected': hasFixedFilters || hasAddedFilters,
      })}
    >
      <div className="row align-items-center">
        <div className="col">
          <div className="d-flex align-items-start">
            {renderHeader()}
            <ul
              className="filter-choices row gutter-5 align-items-center list-unstyled p-0 mb-0"
              ref={ref}
            >
              {renderFixedFilters()}
              {addedFilters}
              <li className="col-auto filter-add">
                <div
                  className={classnames({
                    'dropdown dropdown-add-filter': true,
                    in: isOpen,
                  })}
                >
                  <span
                    className="dropdown-click cursor-pointer text-uppercase font-xs font-weight-semibold py-3 d-inline-block"
                    onClick={() => {
                      setIsOpen(!isOpen);
                      if (isOpen) {
                        setSearch('');
                        setSelectedFilter(undefined);
                      }
                    }}
                  >
                    Add Filter
                  </span>
                  <div
                    className={classnames({
                      'dropdown-menu dropdown-shadow font-xs border-0 w-100 p-0 ': true,
                      in: isOpen,
                    })}
                  >
                    <div className="position-relative">
                      {selectedFilter === undefined &&
                        !props.hideSearch &&
                        renderSearch()}
                      <SavedFilters
                        items={props.savedFilters}
                        onRemove={props.onRemoveFilter}
                        onSelect={resetFilters}
                      />
                      <ul
                        className={classnames({
                          'list-unstyled  m-0 font-weight-semibold': true,
                          'px-3': selectedFilter === undefined,
                        })}
                        ref={filterRef}
                      >
                        {childFilters.map((child, index) => {
                          const childProps = child.props;
                          if (
                            selectedFilter &&
                            selectedFilter !== childProps.filterKey
                          ) {
                            return <></>;
                          }
                          if (childProps.fixed) {
                            return <></>;
                          }

                          if (childProps.noContent) {
                            return React.cloneElement(child, {
                              ...childProps,
                              applyFilter: (value) =>
                                setFilterValue(childProps.filterKey, value),
                              resetFilter: () =>
                                resetFilterValue(childProps.filterKey),
                              onClose: () => setSelectedFilter(undefined),
                              value: filters[childProps.filterKey],
                            });
                          }

                          return (
                            <li key={index} className="border-bottom">
                              <a
                                href="#"
                                className={classnames({
                                  'py-3': true,
                                  'd-block': selectedFilter === undefined,
                                  'd-none': selectedFilter !== undefined,
                                })}
                                onClick={() =>
                                  setSelectedFilter(
                                    selectedFilter === childProps.filterKey
                                      ? undefined
                                      : childProps.filterKey
                                  )
                                }
                              >
                                {childProps.label}
                              </a>
                              <div
                                className={classnames({
                                  'sub-dropdown top-0 left-0 w-100 bg-white zIndex-99': true,
                                  in: selectedFilter === childProps.filterKey,
                                })}
                              >
                                {React.cloneElement(child, {
                                  ...childProps,
                                  applyFilter: (value) =>
                                    setFilterValue(childProps.filterKey, value),
                                  resetFilter: () =>
                                    resetFilterValue(childProps.filterKey),
                                  onClose: () => setSelectedFilter(undefined),
                                  value: filters[childProps.filterKey],
                                })}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-auto">{renderFilterSaveOptions()}</div>
      </div>
    </div>
  );
};
