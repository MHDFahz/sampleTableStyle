/* eslint-disable */
import * as React from 'react';

const ListTableColumn = (
  props
) => {
  let value = props.value;
  if (props.value === undefined || props.value === null) {
    if (props.nullContent) {
      value = props.nullContent;
    }
  } else {
    if (props.formatContent) {
      value = props.formatContent(props.value);
    }
  }
  return <>{value}</>;
};

export default ListTableColumn;
