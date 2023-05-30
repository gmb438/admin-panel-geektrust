import "./styles.css";
import { useState, useEffect } from "react";
import { IconButton, Button, TextField, Modal, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import Grid from "@mui/material/Grid";
import { DataGrid, GridColDef, GridApi, GridCellValue } from "@mui/x-data-grid";

import axios from "axios";
const baseURL =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 5
};
export default function App() {
  const [data, setData] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [editData, setEditData] = useState([]);

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "role",
      headerName: "Role",
      width: 90
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      width: 150,
      renderCell: (params) => {
        const handleDelete = (e) => {
          e.stopPropagation(); // don't select this row after clicking

          const api = params.api;
          const thisRow = {};

          api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
            );
          let temp = data.filter((obj) => thisRow.id !== obj.id);
          setData(temp);
          row = data;
          console.log(thisRow);
        };

        const handleEdit = (e) => {
          e.stopPropagation(); // don't select this row after clicking

          const api = params.api;
          const thisRow = {};

          api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
            );
          handleOpen();
          setEditData(thisRow);
        };

        return (
          <Grid item xs={8}>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={handleEdit}>
              <EditIcon />
            </IconButton>
          </Grid>
        );
      }
    }
  ];

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setData(response.data);
    });
  }, []);

  const deleteSelected = () => {
    let temp = data.filter((obj) => !selectionModel.includes(obj.id));
    setData(temp);
    setSelectionModel([]);
  };

  let row = data.filter(
    (obj) =>
      obj.name.toLowerCase().includes(search) ||
      obj.email.toLowerCase().includes(search) ||
      obj.role.toLowerCase().includes(search)
  );
  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase().trim());
  };

  return (
    <div className="App">
      <div
        style={{
          position: "absolute",
          height: "500px",
          left: "20%",
          right: "20%"
        }}
      >
        <TextField
          placeholder="Search by name, email or role"
          style={{ margin: "5px", width: "500px" }}
          color="primary"
          onChange={handleSearch}
        />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <TextField
              style={{ margin: "2px" }}
              value={editData.name}
              onChange={(e) => {
                setEditData({ ...editData, name: e.target.value });
              }}
            />
            <TextField
              style={{ margin: "2px" }}
              value={editData.email}
              onChange={(e) => {
                setEditData({ ...editData, email: e.target.value });
              }}
            />
            <TextField
              style={{ margin: "2px" }}
              value={editData.role}
              onChange={(e) => {
                setEditData({ ...editData, role: e.target.value });
              }}
            />
            <Button
              style={{ margin: "2px" }}
              variant="outlined"
              color="success"
              onClick={() => {
                let temp = data.map((obj) => {
                  if (obj.id === editData.id) {
                    return editData;
                  } else {
                    return obj;
                  }
                });
                setData(temp);
                handleClose();
              }}
            >
              Update
            </Button>
          </Box>
        </Modal>
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          checkboxSelection
          onSelectionModelChange={(newSelection) => {
            let selection = [];
            if (newSelection.length === data.length) {
              console.log(page);
              selection = newSelection.slice(page * 10, page * 10 + 10);
              setSelectionModel(selection);
            } else {
              setSelectionModel(newSelection);
            }
          }}
          onPageChange={(page) => setPage(page)}
          selectionModel={selectionModel}
        />
        <Button
          onClick={deleteSelected}
          style={{ margin: "5px", position: "relative", left: "10px" }}
          variant="outlined"
          color="error"
        >
          Delete Selected
        </Button>
      </div>
    </div>
  );
}
