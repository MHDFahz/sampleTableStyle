import moment from 'moment';
import * as React from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { DateFormats } from '../../utils/date-utils';
import classnames from 'classnames';

const DateRangeListFilter = (
  props
) => {
  const [range, setRange] = React.useState(
    props.default
  );

  // React.useEffect(() => {
  //   props.onChange(
  //     range?.startDate && range?.endDate
  //       ? { startDate: range.startDate, endDate: range.endDate }
  //       : undefined
  //   );
  // }, [range]);

  React.useEffect(() => {
    if (props.default) {
      setRange(props.default);
    }
  }, [props.default]);

  const onRangeChange = (startDate, endDate) => {
    setRange({
      startDate,
      endDate,
    });
    props.onChange(startDate && endDate ? { startDate, endDate } : undefined);
  };

  const hasValue = range?.startDate && range?.endDate;
  return (
    <React.Fragment>
      <div
        className="col-md-auto col-12 mt-md-0 mt-3 d-flex align-items-center"
        key={JSON.stringify(range || {})}
      >
        <DateRangePicker
          onCallback={(start, end, label) => {
            // onRangeChange(start.toDate(), end.toDate()); Removed after adding onApply
          }}
          onApply={(e, picker) => {
            onRangeChange(picker.startDate?.toDate(), picker.endDate?.toDate());
          }}
          initialSettings={{
            startDate: range?.startDate,
            endDate: range?.endDate,
            locale: { format: DateFormats.NormalDateFormatWithoutHiphons },
            autoUpdateInput: false,
          }}
        >
          <input
            type="text"
            className={classnames({
              'form-control border-0 px-0': true,
              'font-weight-semibold': hasValue,
              'font-weight-normal text-muted': !hasValue,
            })}
            value={`${
              range && hasValue
                ? `${moment(range.startDate).format(
                    DateFormats.NormalDateFormatWithoutHiphons
                  )} - ${moment(range.endDate).format(
                    DateFormats.NormalDateFormatWithoutHiphons
                  )}`
                : 'Select date range'
            }`}
          />
        </DateRangePicker>
        {hasValue && (
          <i
            className="icon-close font-sm"
            onClick={() => {
              setRange(undefined);
              props.onChange(undefined);
            }}
          ></i>
        )}
      </div>
    </React.Fragment>
  );
};

export default DateRangeListFilter;
