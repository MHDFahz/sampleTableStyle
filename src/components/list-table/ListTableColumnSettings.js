/* eslint-disable */
import * as React from 'react';
import { IListTableColumnProps } from './ListTableColumn';
import classnames from 'classnames';
import ListTableColumnSettingsGroup from './ListTableColumnSettingsGroup';
import {
  arrayMove,
  SortableContainer,
  SortableElement,
} from 'react-sortable-hoc';


const ListTableColumnSettings = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState(props.selected);
  const [gridFilterHeight, setGridFilterHeight] = React.useState();

  const onSelect = (column, sel) => {
    if (sel) {
      setSelected([...(selected || []), column]);
    } else {
      setSelected(selected?.filter((col) => col !== column) || []);
    }
  };

  React.useEffect(() => {
    setSelected(props.selected);
  }, [props.selected]);

  const onSave = () => {
    props.onChange?.(selected || []);
    setIsOpen(false);
  };

  const onCancel = () => {
    setSelected(props.selected || []);
    setIsOpen(false);
  };

  const searchColumns = (
    cols,
    term
  ) => {
    if (!term) {
      return cols;
    }
    return cols?.filter(
      (col) =>
        col && col.label?.match(new RegExp(term.toLocaleLowerCase(), 'i'))
    );
  };

  const allSelectedColumns = selected
    ?.map((col) => props.columns?.find((coll) => coll.column === col))
    ?.filter((col) => !!col);
  const allNonSelectedColumns = props.columns?.filter(
    (coll) => !selected?.find((col) => coll.column === col)
  );
  const selectedColumns = searchColumns(allSelectedColumns, search);

  const nonSelectedColumns = searchColumns(allNonSelectedColumns, search);

  const GridFilterHeight = () => {
    const tableHeight = document
      ?.querySelector('.grid-table-filter')
      ?.closest('.grid-table')?.clientHeight;
    let gridHeight;
    if (tableHeight) {
      gridHeight = tableHeight - 40;
    }
    setGridFilterHeight(gridHeight);
  };

  const SortableItem = SortableElement(({ value }) => {
    const col = value;
    if (!col) {
      return <></>;
    }
    const id = `col-settings-${col.column}`;
    return (
      <li className="p-2 border-bottom draggable-list" key={id}>
        <div className="py-1 d-flex">
          <input
            type="checkbox"
            id={id}
            checked={true}
            onChange={(e) => {
              onSelect(col.column, e.target.checked);
            }}
          />
          <label htmlFor={id}>{col?.label}</label>
          <i className="icon-drag-indicator ml-auto text-gray-400 font-xxl"></i>
        </div>
      </li>
    );
  });

  const SortableList = SortableContainer<any>(({ items }) => {
    return (
      <ul className="list-unstyled p-2 m-0 font-normal">
        {items.map((value, index) => (
          <SortableItem
            key={`item-${value.column}`}
            index={index}
            value={value}
          />
        ))}
      </ul>
    );
  });
  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newList = arrayMove(selected ?? [], oldIndex, newIndex);
    const validatedColumns =
      newList?.filter(
        (p) => allSelectedColumns?.find((q) => q.column === p) != null
      ) ?? [];

    if (oldIndex !== newIndex) {
      setSelected(validatedColumns);
    }
  };
  const shouldCancelStart = (e) => {
    if (e.target.tagName.toLowerCase() !== 'i') {
      // Return true to cancel sorting
      return true;
    }
    return false;
  };

  return (
    <div className="position-relative">
      <span
        className="bg-white cursor-pointer d-inline-block p-2 border-left w-100 text-center"
        onClick={() => {
          GridFilterHeight();
          setIsOpen(!isOpen);
        }}
      >
        <i className="icon-settings font-xl p-1"></i>
      </span>
      <div
        className={classnames({
          'grid-table-filter border bg-white overflow-auto': true,
          in: isOpen,
        })}
        style={{ height: gridFilterHeight + 'px' }}
      >
        <div className="filter-top py-3 px-2 position-sticky top-0 bg-white zIndex-1">
          <div className="px-1">
            <input
              type="text"
              className="form-control form-control-sm bg-gray-100"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="filter-middle">
          {(selectedColumns?.length || 0) > 0 && (
            <>
              <div className="heading bg-gray-100 px-2">
                <h6 className="m-0 px-1 text-uppercase font-xxs font-weight-semibold">
                  Visible
                </h6>
              </div>

              <SortableList
                onSortStart={(_, event) => event.preventDefault()}
                shouldCancelStart={shouldCancelStart}
                items={selectedColumns}
                onSortEnd={onSortEnd}
              />
            </>
          )}
          {(nonSelectedColumns?.length || 0) > 0 && (
            <>
              <div className="heading bg-gray-100 px-2">
                <h6 className="m-0 px-1 text-uppercase font-xxs font-weight-semibold">
                  Not Visible
                </h6>
              </div>
              <ListTableColumnSettingsGroup
                columns={nonSelectedColumns || []}
                onSelect={onSelect}
              />
            </>
          )}
        </div>
        <div className="filter-bottom px-2 position-sticky bottom-0 bg-white">
          <div className="border-top p-2">
            <div className="row gutter-10">
              <div className="col-4">
                <button
                  className="btn btn-outline-light text-gray-900 px-4 py-2 font-normal font-weight-bold"
                  onClick={() => {
                    props.onDefaultClicked?.();
                    setIsOpen(false);
                  }}
                >
                  <span className="px-1">Default</span>
                </button>
              </div>
              <div className="col-8 d-flex justify-content-end">
                <button
                  className="btn btn-outline-light text-gray-900 px-4 py-2 font-normal font-weight-bold"
                  onClick={onCancel}
                >
                  <span className="px-1">Cancel</span>
                </button>
                <button
                  className="btn btn-primary px-4 py-2 font-normal font-weight-bold ml-2"
                  disabled={!selected?.length}
                  onClick={onSave}
                >
                  <span className="px-1">Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListTableColumnSettings;
