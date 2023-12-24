import React from "react";
import { DataGrid, viVN } from "@mui/x-data-grid";
import "./dataTable.css";
import { Link } from "react-router-dom";

const DataTable = (props) => {
  const actionColumn = {
    field: "action",
    headerName: "Chi tiết",
    sortable: false,
    width: props.width80 ? props.width80 : 200,
    renderCell: (params) => {
      return (
        <div className="action">
          {props.handleUpdateOrderStatus || props.handleUpdateAccountRole ? (
            <div
              className="update"
              onClick={() => {
                if (props.handleUpdateOrderStatus) {
                  props.handleUpdateOrderStatus(params.row.id);
                } else if (props.handleUpdateAccountRole) {
                  props.handleUpdateAccountRole(params.row.accountId);
                }
              }}
            >
              {props.customerRole ? (
                <img src="/eye.svg" alt="" />
              ) : (
                <img src="/view.svg" alt="" />
              )}
            </div>
          ) : props.tourSwitch ? (
            <>
              <Link to={`/${props.slug}/${params.row.tourId}`}>
                <img src="/view.svg" alt="" />
              </Link>
              <div className="switch-container">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={params.row.status}
                    onChange={() =>
                      props.onSwitchChange(params.row.tourId, params.row.status)
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </>
          ) : (
            <>
              <Link to={`/${props.slug}/${params.row.id}`}>
                <img src="/view.svg" alt="" />
              </Link>
            </>
          )}
        </div>
      );
    },
  };

  return (
    <div className="dataTable">
      <DataGrid
        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
        className="dataGrid"
        rows={props.rows}
        columns={[...props.columns, actionColumn]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5, 10, 20, 50]}
      />
    </div>
  );
};

export default DataTable;
