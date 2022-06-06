import { useState, useEffect, useContext, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";

import axios from "axios";
import swal from "sweetalert";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Product name", width: 270 },
  { field: "price", headerName: "Price", width: 100, type: "number" },
  { field: "buyer_name", headerName: "Buyer name", width: 130 },
  { field: "buyer_phone", headerName: "Buyer phone", width: 130 },
  { field: "seller_name", headerName: "Seller name", width: 130 },
  { field: "seller_phone", headerName: "Seller phone", width: 130 },
  { field: "order_status", headerName: "Order Status", width: 130 },
  { field: "date", headerName: "Date", width: 270 },

  // {
  //   field: "age",
  //   headerName: "Age",
  //   type: "number",
  //   width: 90,
  // },
  // {
  //   field: "fullName",
  //   headerName: "Full name",
  //   description: "This column has a value getter and is not sortable.",
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params) =>
  //     `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  // },
];

// const rows = [
//   { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
//   { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
//   { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
//   { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
//   { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
//   { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
//   { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
//   { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
//   { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
// ];

export default function All_orders() {
  const api = process.env.REACT_APP_API;

  const [allorders, setAllorders] = useState([]);

  const getallorders = () => {
    console.log("func furn");
    axios({
      method: "GET",
      withCredentials: true,
      url: `${api + "/allorders"}`,
    })
      .then((res) => {
        console.log(res);
        setAllorders(res.data.row);
        console.log(res.data.row);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getallorders();
  }, []);

  return (
    <>
      <div className="page">
        <h2 className="heading">All Direct Orders</h2>
        <div style={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={allorders}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </div>
      </div>
    </>
  );
}
