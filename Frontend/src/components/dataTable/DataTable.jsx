import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import "./dataTable.css";
import { Link } from "react-router-dom";

const DataTable = (props) => {
  // TEST THE API

  const handleDelete = (id) => {
    //delete the item
    // mutation.mutate(id)
  };

  const actionColumn = {
    field: "action",
    headerName: "Action",
    sortable: false,
    width: 200,
    renderCell: (params) => {
      return (
        <div className="action">
          {props.handleUpdateOrderStatus ? (
            <div
              className="update"
              onClick={() =>
                props.handleUpdateOrderStatus(params.row.id, params.row.status)
              }
            >
              <img src="/view.svg" alt="" />
            </div>
          ) : (
            <Link to={`/${props.slug}/${params.row.id}`}>
              <img src="/view.svg" alt="" />
            </Link>
          )}
          <div className="delete" onClick={() => handleDelete(params.row.id)}>
            <img src="/delete.svg" alt="" />
          </div>
        </div>
      );
    },
  };

  return (
    <div className="dataTable">
      <DataGrid
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
        // slots={{ toolbar: GridToolbar }}
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
