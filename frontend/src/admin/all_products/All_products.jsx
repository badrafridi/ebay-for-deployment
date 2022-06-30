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
  const api = process.env.REACT_APP_API;

  const getallproducts = () => {


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

  const deleteProduct = (id) => {
    axios({
      method: "DELETE",
      data: {
        id,
      },
      withCredentials: true,
      url: `${api + "/deleteproductbyadmin"}`,
    })
      .then((res) => {
        if (res.data.errno === 1451) {
          swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: '<a href="">Why do I have this issue?</a>',
          });
        }
        if (res.data.message == "product successfully deleted") {
          swal({
            title: "The product has been deleted successfully",
            text: "",
            icon: "success",
            button: "Ok",
          });
          getallproducts();
        }
      })
      .catch((err) => {
        console.log(err)
        swal({
          icon: "error",
          title: "Oops...",
          text: "Can not delete a product while it is in order",
          button: "Ok, sorry",
        });
      });
  }

  useEffect(() => {
    getallproducts();
  }, []);

  return (
    <>
      <div className="page">
        <h2 className="heading">All products</h2>
        {/* <div style={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={allproducts}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </div> */}

        <table className="table">
          <thead>
            <tr className="links">
              <th scope="col">ID</th>
              <th scope="col">PRODUCT NAME</th>
              <th scope="col">PRICE</th>
              <th scope="col">CATEGORY</th>
              <th scope="col">STATUS</th>
              <th scope="col">TYPE</th>
              <th scope="col">SELLER NAME</th>
              <th scope="col">SELLER PHONE</th>
              <th scope="col">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {allproducts &&
              allproducts
                .map((p) => {
                  return (
                    <>
                      <tr key={p.id}>
                        <th scope="row">{p.id}</th>
                        <td>{p.name}</td>
                        <td>{p.price}</td>
                        <td>{p.category_name}</td>
                        <td>{p.status}</td>
                        <td>{p.type}</td>
                        <td>{p.seller_name}</td>
                        <td>{p.seller_phone}</td>
                        <td><i class="fa fa-times deleteIconforcat" aria-hidden="true" onClick={() => {

                          if (
                            window.confirm(
                              "Are you sure you want to delete this product?"
                            )
                          ) {
                            deleteProduct(p.id)
                          }

                        }}></i></td>
                      </tr>
                    </>
                  );
                })}
          </tbody>
        </table>



      </div>
    </>
  );
}
