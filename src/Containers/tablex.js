/* eslint-disable */
import React, { useState } from "react";
import moment from "moment";
import classnames from "classnames";
import { ListTable, ListTableColumn } from "../components/list-table";
import {
  ListHeader,
  ListHeaderDropdown,
  ListHeaderSearch,
} from "../components/list-header";
import Moment from "react-moment";
import DateRangeListFilter from "../components/list-filters/DateRangeListFilter";
import { ListFilters, MultiSelectFilter } from "../components/list-filters";
import Pagination from "../components/pagination/Pagination";

const data = [
  {
    _id: 1,
    fullName: "Muhammed Fahis",
    createdAt: new Date(),
  },
  {
    _id: 2,
    fullName: "Raj",
    createdAt: new Date(),
  },
  {
    _id: 3,
    fullName: "Jhon",
    createdAt: new Date(),
  },
];
export default function SampleTable() {
  // const params = useLocation().search;
  const [selected, setSelected] = useState([]);

  const loadFromQuery = () => {
    // const queryFilter: QueryFilter = {};
    // const queries = queryString.parse('params');
    // queryFilter.query = queries.query as string;
    // if (queries.filters) {
    //   queryFilter.filters = JSON.parse(queries.filters?.toString());
    // }
    // if (queries.page) {
    //   queryFilter.page = Number(queries.page || 1);
    // }
    // if (queries.perPage) {
    //   queryFilter.perPage = Number(queries.perPage || 1);
    // }
    // if (queries.startDate) {
    //   queryFilter.startDate = moment(queries.startDate as string).toDate();
    // }
    // if (queries.endDate) {
    //   queryFilter.endDate = moment(queries.endDate as string).toDate();
    // }
    // if (queries.sort) {
    //   queryFilter.sort = JSON.parse(queries.sort?.toString());
    // }
    // return queryFilter;
  };
  const [sort, setSort] = useState({
    sortBy: "createdAt",
    sortOrder: "DESC",
  });
  const [search, setSearch] = useState("");
  const [dateFilters, setDateFilters] = useState({
    startDate: undefined,
    endDate: undefined,
  });
  const columns = [
    <ListTableColumn
      label="Full Name"
      source="fullName"
      column="fullName"
      sortable
      showDefault
      settingsGroup="fullName"
      sortKey="fullName"
    ></ListTableColumn>,
    <ListTableColumn
      label="Date"
      source="createdAt"
      column="createdAt"
      formatContent={(d) => moment(d).format("DD MMM YYYY")}
      sortable
    ></ListTableColumn>,
    <ListTableColumn
      label="View"
      column="view"
      fixed={true}
      fixedPosition={"start"}
      source="_id"
      formatContent={(customerId) => {
        return <a href={`somewhere/${customerId}`}>View</a>;
      }}
    ></ListTableColumn>,
    <ListTableColumn
      label="Some Action"
      column="someAction"
      source="_id"
      diableClick
      formatContent={(customerId) => {
        return (
          <div
            className="btn btn-primary btn-sm"
            onClick={() => alert(`Id : ${customerId}`)}
          >
            Scan
          </div>
        );
      }}
    ></ListTableColumn>,
  ];
  const actions = [
    {
      text: "Add Patient",
      onClick: () => {
        alert("Do Smothing");
      },
    },
  ];
  const headerActions = [
    <ListHeaderSearch
      placeholder="Patient Name / Mobile/ Email"
      serachTerm={search}
      onSearch={(val) => {
        // onChangeFilter(filters, val, page, perPage, dateFilters, sort);
        setSearch(val);
      }}
    />,
    <DateRangeListFilter
      default={dateFilters}
      onChange={(d) => {
        setDateFilters({
          startDate: d?.startDate,
          endDate: d?.endDate,
        });
        if (loaded) {
          // onChangeFilter(
          //   filters,
          //   search,
          //   page,
          //   perPage,
          //   {
          //     startDate: d?.startDate,
          //     endDate: d?.endDate,
          //   },
          //   sort
          // );
        }
      }}
    />,
    <ListHeaderDropdown text="Action" actions={actions} />,
    <span
      className="cursor-pointer"
      onClick={() => {
        alert("Download some thing");
      }}
    >
      <i className="icon-download font-xxl"></i>
    </span>,
  ];
  const [filters, setFilters] = useState({});
  const filterRow = (
    <ListFilters
      key="filter-row"
      savedFilters={[]}
      onSaveFilter={() => {}}
      isSavingFilter={() => {}}
      onRemoveFilter={() => {}}
      filters={filters}
      onFilter={(searchFilters) => {
        // onChangeFilter(searchFilters, search, page, perPage, dateFilters, sort);
        setFilters(searchFilters);
      }}
    >
      <MultiSelectFilter
        label="sample multi filter"
        filterKey="sampleMultiFilter"
        key="sampleMultiFilter"
        allowSearch
        options={[
          { _id: "111", name: "fahis" },
          { _id: "112", name: "suresh" },
        ]}
        valueField="_id"
        labelField="name"
      />
    </ListFilters>
  );
  return (
    <>
      <div className="container-fluid">
        <ListHeader additionalRows={filterRow} actions={headerActions}>
          <h2 className="m-0">
            Patients
            {data && (
              <span className="font-xs text-muted font-weight-semibold ml-2">
                {data.count} Total{" "}
                <span className="font-weight-normal ml-1">
                  Updated <Moment fromNow date={new Date()} />
                </span>
                {false && (
                  <span className="font-weight-normal ml-1">
                    Selected {1} items
                  </span>
                )}
              </span>
            )}
          </h2>
        </ListHeader>
        <ListTable
          data={data}
          showSelectOption={true}
          showColumnSettings={false}
          selectedColumns={[]}
          onColumnSettingsSaved={() => {}}
          selectedValues={selected}
          onSelect={setSelected}
          onSort={(sortKey, sortOrder) => {
            // setSort({ sortBy: sortKey, sortOrder });
            // onChangeFilter(
            //   filters,
            //   search,
            //   page,
            //   perPage,
            //   dateFilters,
            //   {
            //     sortBy: sortKey,
            //     sortOrder,
            //   }
            // );
          }}
          sort={sort}
          trProps={(d) => {
            return {
              className: classnames({
                new: false,
                "cursor-pointer": true,
              }),
            };
          }}
          onRowClick={(d) => alert("Click on row")}
        >
          {columns}
        </ListTable>
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={(pg) => {
            // setPage(pg);
            // onChangeFilter(filters, search, pg, perPage, dateFilters, sort);
          }}
          perPage={25}
          onPerPageChange={(pg) => {
            // setPerPage(pg);
            // onChangeFilter(filters, search, page, pg, dateFilters, sort);
          }}
          count={125}
          label="Patients"
        />
      </div>
    </>
  );
}
