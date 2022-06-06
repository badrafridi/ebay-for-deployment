import { useState, useEffect, useContext, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";

import axios from "axios";
import swal from "sweetalert";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Product name", width: 270 },
  { field: "price", headerName: "Price", width: 100, type: "number" },
  { field: "category_name", headerName: "Category", width: 130 },
  { field: "status", headerName: "Status", width: 130 },
  { field: "type", headerName: "Type", width: 130 },
  { field: "seller_name", headerName: "Seller name", width: 130 },
  { field: "seller_phone", headerName: "Seller phone", width: 130 },
];

export default function All_products() {
  const [allproducts, setAllproducts] = useState([]);

  const getallproducts = () => {
    const api = process.env.REACT_APP_API;

    console.log("products function running");
    axios({
      method: "GET",
      withCredentials: true,
      url: `${api + "/allproductsforadmin"}`,
    })
      .then((res) => {
        console.log(res);
        setAllproducts(res.data.row);
        console.log(res.data.row);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getallproducts();
  }, []);

  return (
    <>
      <div className="page">
        <h2 className="heading">All products</h2>
        <div style={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={allproducts}
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
