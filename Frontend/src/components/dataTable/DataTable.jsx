import { DataGrid, viVN } from "@mui/x-data-grid";
import "./dataTable.css";
import { Link } from "react-router-dom";

const DataTable = (props) => {
  // TEST THE API

  // const handleEnableOrDisable = (id) => {};

  const actionColumn = {
    field: "action",
    headerName: props.customerRole ? "Chi tiết" : "Action",
    sortable: false,
    width: props.width80 ? props.width80 : 200,
    renderCell: (params) => {
      return (
        <div className="action">
          {props.handleUpdateOrderStatus ? (
            <div
              className="update"
              onClick={() => props.handleUpdateOrderStatus(params.row.id)}
            >
              {props.customerRole ? (
                <img src="/eye.svg" alt="" />
              ) : (
                <img src="/view.svg" alt="" />
              )}
            </div>
          ) : props.tourSwitch ? (
            <Link to={`/${props.slug}/${params.row.tourId}`}>
              <img src="/view.svg" alt="" />
            </Link>
          ) : (
            <Link to={`/${props.slug}/${params.row.id}`}>
              <img src="/view.svg" alt="" />
            </Link>
          )}
          {!props.customerRole && props.tourSwitch ? (
            <div
              className="delete"
              onClick={() => props.handleEnableOrDisable(params.row.tourId)}
            >
              <img
                src={require("../../assets/images/switchBtn.png")}
                alt="switch"
              />
            </div>
          ) : null}
        </div>
      );
    },
  };

  return (
    <div className="dataTable">
      <DataGrid
        localeText={
          props.VietNamese
            ? viVN.components.MuiDataGrid.defaultProps.localeText
            : ""
        }
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
