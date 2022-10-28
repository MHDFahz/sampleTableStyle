/* eslint-disable */
import * as React from 'react';
import classnames from 'classnames';
import { getUniqueValues } from '../../utils/array-utils';

const ListTableColumnSettingsGroup = (props) => {
  const groups = getUniqueValues(
    props.columns.map((col) => col.settingsGroup)
  ).sort();
  const [selectedGroup, setSelectedGroup] = React.useState(groups[0]);
  React.useEffect(() => {
    if (groups.length > 0 && !groups.includes(selectedGroup)) {
      setSelectedGroup(groups[0]);
    }
  }, [groups, selectedGroup]);
  return (
    <>
      <div className="tabButton tabButton--primary d-flex w-100 text-center font-xs font-weight-semibold cursor-pointer my-2 pt-1 px-4 text-uppercase">
        {groups.map((grp) => {
          return (
            <div
              key={grp || 'Other'}
              className={classnames({
                'tabButton__item flex-fill px-4 py-2 text-capitalize': true,
                'tabButton__item--active': selectedGroup === grp,
              })}
              onClick={() => setSelectedGroup(grp)}
            >
              {grp || 'Other'}
            </div>
          );
        })}
      </div>

      <div className="tabButtonContent">
        {groups.map((grp) => {
          return (
            <div
              key={grp || 'Other'}
              className={classnames({
                tabButtonContent__item: true,
                'tabButtonContent__item--active': selectedGroup === grp,
              })}
            >
              <ul className="list-unstyled px-2 m-0 font-normal">
                {props.columns
                  .filter((col) => col.settingsGroup === grp)
                  .map((col) => {
                    const id = `col-settings-${col.column}`;
                    return (
                      <li className="p-2 border-bottom" key={id}>
                        <div className="py-1">
                          <input
                            type="checkbox"
                            id={id}
                            onChange={(e) =>
                              props.onSelect(col.column, e.target.checked)
                            }
                            checked={false}
                          />
                          <label htmlFor={id}>{col.label}</label>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ListTableColumnSettingsGroup;
