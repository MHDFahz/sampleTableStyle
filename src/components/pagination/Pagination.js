import * as React from 'react';
import classnames from 'classnames';
import { DropdownList } from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';

const Pagination = (props) => {
  if (props.totalPages <= 0) {
    return <></>;
  }
  const padding = props.padding || 1;
  const groupCount = padding * 2 + 1;
  const changePage = (page) => {
    props.onPageChange?.(page);
  };

  const renderPage = (page) => {
    return (
      <li
        key={page}
        className={classnames({
          'page-item': true,
          active: props.currentPage === page,
        })}
      >
        <a
          className="page-link"
          href="javascript:void(0)"
          onClick={() => changePage(page)}
        >
          {page}
        </a>
      </li>
    );
  };

  const renderEllipsis = () => <li className="page-item">...</li>;

  const renderStart = () => {
    if (props.currentPage <= groupCount) {
      return new Array(Math.max(groupCount, props.currentPage + padding))
        .fill('')
        .map((_, index) => renderPage(index + 1));
    } else {
      return (
        <>
          {renderPage(1)}
          {renderEllipsis()}
        </>
      );
    }
  };

  const renderMid = () => {
    if (
      props.currentPage > groupCount &&
      props.currentPage < props.totalPages - groupCount + padding - 1
    ) {
      return new Array(groupCount)
        .fill('')
        .map((_, index) => renderPage(index + props.currentPage - padding));
    }

    return <></>;
  };

  const renderEnd = () => {
    if (props.currentPage >= props.totalPages - groupCount + padding - 1) {
      const offset = Math.max(
        groupCount,
        props.totalPages - props.currentPage + groupCount - padding
      );
      return new Array(offset)
        .fill('')
        .map((_, index) => renderPage(index + props.totalPages - offset + 1));
    } else {
      return (
        <>
          {renderEllipsis()}
          {renderPage(props.totalPages)}
        </>
      );
    }
  };

  const renderLeftArrow = () => {
    return (
      <li
        className={classnames({
          'page-item page-control': true,
          disabled: props.currentPage === 1,
        })}
      >
        <a
          className="page-link"
          href={props?.skipScrollToTop ? 'javascript:void(0)' : '#'}
          onClick={() => changePage(props.currentPage - 1)}
        >
          <i className="icon-chevron-left"></i>
        </a>
      </li>
    );
  };

  const renderRightArrow = () => {
    return (
      <li
        className={classnames({
          'page-item page-control': true,
          disabled: props.currentPage === props.totalPages,
        })}
      >
        <a
          className="page-link"
          href={props?.skipScrollToTop ? 'javascript:void(0)' : '#'}
          onClick={() => changePage(props.currentPage + 1)}
        >
          <i className="icon-chevron-right"></i>
        </a>
      </li>
    );
  };

  const showEllipsis = props.totalPages > (padding + 1) * 2 + 1;

  return (
    <div className="page">
      <ul className="pagination">
        {renderLeftArrow()}
        {!showEllipsis &&
          new Array(props.totalPages)
            .fill('')
            .map((_, index) => renderPage(index + 1))}
        {showEllipsis && (
          <>
            {renderStart()}
            {renderMid()}
            {renderEnd()}
          </>
        )}

        {renderRightArrow()}
      </ul>
      <div className="font-normal pl-3 mx-1 pr-2 text-gray-500">Showing</div>
      <div className="text-center" style={{ width: 70 }}>
        <DropdownList
          dropUp
          containerClassName="sn"
          defaultValue={props.perPage}
          data={[
            { value: 10, name: '10' },
            { value: 20, name: '20' },
            { value: 30, name: '30' },
            { value: 50, name: '50' },
            { value: 100, name: '100' },
            { value: 150, name: '150' },
          ]}
          valueField="value"
          textField="name"
          onChange={(val) => props.onPerPageChange?.(val.value)}
        ></DropdownList>
      </div>
      <div className="pl-2 font-normal text-gray-500">
        of {props.count} {props.label}
      </div>
    </div>
  );
};

export default Pagination;
