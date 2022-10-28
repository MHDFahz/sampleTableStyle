import * as React from 'react';
import ListTableColumnSettings from './ListTableColumnSettings';
import classnames from 'classnames';
import { findNestedObjectValue } from '../../utils/findNestedObjectValue';

const ListTable = (props) => {
  const childrens = React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      return child;
    }
  })?.filter((child) => !!child);

  const earlierSelectedColumns = props.selectedColumns
    ?.sort((col1, col2) => col1.order - col2.order)
    ?.map((col) => col.key);
  const defaultColumns =
    childrens
      ?.filter((child) => child.props.showDefault)
      .map((child) => child.props.column) || [];
  const allColumns = childrens?.map((child) => child.props.column) || [];

  const [selectedColumns, setSelectedColumns] = React.useState(
    props.showColumnSettings
      ? earlierSelectedColumns || defaultColumns
      : allColumns
  );

  const allIds = props.data?.map(
    (d) => d?.[props.recordId || '_id']
  );
  const allSelected =
    (props.selectedValues?.length || 0) > 0 &&
    !allIds?.find((id) => !props.selectedValues?.includes(id));

  const onSelect = (value, selected) => {
    if (selected) {
      props.onSelect?.([...(props.selectedValues || []), value]);
    } else {
      props.onSelect?.(
        props.selectedValues?.filter((val) => val !== value) || []
      );
    }
  };

  const fixedAtStartColumns = childrens
    ?.filter(
      (child) => child.props.fixed && child.props.fixedPosition === 'start'
    )
    .map((child) => child.props.column);
  const fixedAtEndColumns = childrens
    ?.filter(
      (child) => child.props.fixed && child.props.fixedPosition !== 'start'
    )
    .map((child) => child.props.column);

  React.useEffect(() => {
    const localDefaultColumns =
      props.selectedColumns
        ?.sort((col1, col2) => col1.order - col2.order)
        ?.map((col) => col.key) ||
      childrens
        ?.filter((child) => child.props.showDefault)
        .map((child) => child.props.column) ||
      [];
    const localAllColumns =
      childrens?.map((child) => child.props.column) || [];

    setSelectedColumns(
      props.showColumnSettings ? localDefaultColumns : localAllColumns
    );
  }, [props.selectedColumns, props.showColumnSettings]);

  const onAllSelected = (selected) => {
    if (selected) {
      props.onSelect?.(allIds || []);
    } else {
      props.onSelect?.([]);
    }
  };

  const renderColumnValue = (
    column,
    index,
    data,
    fixed
  ) => {
    const child = childrens?.find((ch) => ch.props?.column === column);
    if (!child) {
      return <></>;
    }
    const childProps = child?.props;
    if (!!childProps.fixed !== !!fixed) {
      return <></>;
    }
    const value = Array.isArray(childProps.source)
      ? childProps.source.map((src) => findNestedObjectValue(data, src))
      : findNestedObjectValue(data, childProps.source);

    const anotherValue = childProps.anotherSource
      ? Array.isArray(childProps.anotherSource)
        ? childProps.anotherSource.map((src) =>
            findNestedObjectValue(data, src)
          )
        : findNestedObjectValue(data, childProps.anotherSource)
      : '';

    return (
      <td
        className={childProps.cssClass}
        key={column}
        colSpan={
          props.showColumnSettings &&
          ((!fixed &&
            index === selectedColumns.length - 1 &&
            !fixedAtEndColumns?.length) ||
            (fixed && index === (fixedAtEndColumns?.length || 0) - 1))
            ? 2
            : 1
        }
        onClick={() =>
          childProps.diableClick
            ? undefined
            : childProps.onClick
            ? childProps.onClick(data, index, value)
            : props.onRowClick?.(data, index)
        }
        {...childProps.tdProps}
      >
        {child &&
          React.cloneElement(child, {
            ...childProps,
            value,
            anotherValue,
          })}
      </td>
    );
  };

  const renderColumnHeader = (column, fixed) => {
    const child = childrens?.find((ch) => ch.props?.column === column);
    if (!child) {
      return <></>;
    }
    const childProps = child?.props;
    if (!!childProps.fixed !== !!fixed) {
      return <></>;
    }
    return (
      <th key={column} className={childProps.cssClass}>
        <span className="d-inline-flex align-items-center">
          {childProps.label}
          {childProps.sortable && (
            <span
              className={classnames({
                'sort d-inline-flex flex-column ml-2': true,
                asc:
                  props.sort?.sortOrder !== 'ASC' ||
                  props.sort?.sortBy !==
                    (childProps.sortKey || childProps.column),
                desc:
                  props.sort?.sortOrder !== 'DESC' ||
                  props.sort?.sortBy !==
                    (childProps.sortKey || childProps.column),
              })}
              onClick={
                childProps.sortable
                  ? () =>
                      props.onSort?.(
                        childProps.sortKey || childProps.column,
                        props.sort?.sortBy ===
                          (childProps.sortKey || childProps.column) &&
                          props.sort?.sortOrder !== SortOrder.DESC
                          ? SortOrder.DESC
                          : SortOrder.ASC
                      )
                  : undefined
              }
            >
              <i className="icon-caret-up"></i>
              <i className="icon-caret-down"></i>
            </span>
          )}
        </span>
      </th>
    );
  };

  const renderHeader = () => {
    return (
      <thead>
        <tr>
          {props.showSelectOption && (
            <th className="check-all text-center">
              <input
                type="checkbox"
                id="checkall"
                checked={allSelected}
                onChange={(e) => onAllSelected(e.target.checked)}
              />
              <label htmlFor="checkall"></label>
            </th>
          )}
          {fixedAtStartColumns?.map((col) => renderColumnHeader(col, true))}
          {selectedColumns?.map((col) => renderColumnHeader(col, false))}
          {fixedAtEndColumns?.map((col) => renderColumnHeader(col, true))}
          {props.showColumnSettings && (
            <th className="action position-sticky right-0 p-0 zIndex-1">
              <ListTableColumnSettings
                selected={selectedColumns}
                columns={childrens
                  ?.map((child) => child.props)
                  .filter((pr) => !pr.fixed)}
                onChange={(columns) => {
                  props.onColumnSettingsSaved?.(
                    columns.map((col, index) => {
                      return {
                        key: col,
                        order: index + 1,
                      };
                    })
                  );
                  setSelectedColumns(columns);
                }}
                onDefaultClicked={() => {
                  props.onColumnSettingsSaved?.(
                    defaultColumns.map((col, index) => {
                      return {
                        key: col,
                        order: index + 1,
                      };
                    })
                  );
                  setSelectedColumns(defaultColumns || []);
                }}
              />
            </th>
          )}
        </tr>
      </thead>
    );
  };

  const renderRow = (d, ind) => {
    return (
      <tr key={ind} className={props.trProps?.(d,ind).className}>
        {props.showSelectOption && (
          <td className="check-all text-center">
            <input
              type="checkbox"
              id={`check-${d?.[props.recordId || '_id']}`}
              checked={props.selectedValues?.includes(
                d?.[props.recordId || '_id']
              )}
              onChange={(e) =>
                onSelect(d?.[props.recordId || '_id'], e.target.checked)
              }
            />
            <label htmlFor={`check-${d?.[props.recordId || '_id']}`}></label>
          </td>
        )}
        {fixedAtStartColumns?.map((column, index) =>
          renderColumnValue(column, index, d, true)
        )}
        {selectedColumns.map((column, index) =>
          renderColumnValue(column, index, d)
        )}
        {fixedAtEndColumns?.map((column, index) =>
          renderColumnValue(column, index, d, true)
        )}
      </tr>
    );
  };
  return (
    <div className="grid-table">
      <table id={props.id}>
        {renderHeader()}
        <tbody>
          {props.data?.map((d, index) => {
            return renderRow(d, index);
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ListTable;
