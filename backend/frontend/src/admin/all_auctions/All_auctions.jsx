import { useState, useEffect, useContext, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";

import axios from "axios";
import swal from "sweetalert";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "product_name", headerName: "Product name", width: 270 },
  { field: "price", headerName: "Price", width: 100, type: "number" },
  { field: "last_bidder_name", headerName: "Buyer name", width: 130 },
  { field: "last_bidder_phone", headerName: "Buyer phone", width: 130 },
  { field: "last_bid", headerName: "Last bid", width: 100, type: "number" },
  { field: "seller_name", headerName: "Seller name", width: 130 },
  { field: "seller_phone", headerName: "Seller phone", width: 130 },
  { field: "status", headerName: "Status", width: 130 },
  { field: "end_date", headerName: "Auction end date", width: 270 },
];

export default function All_auctions() {
  const [allauctions, setAllauctions] = useState([]);

  const getallauctions = () => {
    const api = process.env.REACT_APP_API;

    console.log("auction function running");
    axios({
      method: "GET",
      withCredentials: true,
      url: `${api + "/allauctions"}`,
    })
      .then((res) => {
        console.log(res);
        setAllauctions(res.data.row);
        console.log(res.data.row);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getallauctions();
  }, []);

  return (
    <>
      <div className="page">
        <h2 className="heading">All Auction Orders</h2>
        <div style={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={allauctions}
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
