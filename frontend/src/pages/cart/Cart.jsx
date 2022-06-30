import { useState, useEffect, useContext, useRef } from "react";
import "./cart.css";
import axios from "axios";
import { UserContext } from "../../userContext";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

import { CartContext } from "../../cartContext";

export default function Cart(props) {
  const api = process.env.REACT_APP_API;

  const { usertop, setUsertop } = useContext(UserContext);

  const [products, setProducts] = useState([]);
  const { cart, setCart } = useContext(CartContext);
  const [total, setTotal] = useState(0);
  const name = useRef();
  const phone = useRef();
  const address = useRef();
  const [productids, setProductids] = useState([]);
  const navigate = useNavigate();

  const getProducts = () => {
    console.log("funct called");
    if (cart) {
      axios({
        method: "POST",
        data: { cart },
        withCredentials: true,
        url: `${api + "/getproductsforcart"}`,
      })
        .then((res) => {
          setProducts(res.data.row);

          var totalx = 0;
          var productIdsx = [];
          res.data.row.map((row) => {
            totalx = totalx + row.price;
            productIdsx.push(row.id);
          });
          setProductids(productIdsx);

          setTotal(totalx);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const placeOrder = (e) => {
    e.preventDefault();
    const namex = name.current.value;
    const phonex = phone.current.value;
    const addressx = address.current.value;

    axios({
      method: "POST",
      data: {
        namex,
        phonex,
        addressx,
        productids,
      },
      withCredentials: true,
      url: `${api + "/placeorder"}`,
    })
      .then((res) => {
        if (
          res.data.message ==
          "order placed successfully, and product status updated to sold"
        ) {
          console.log(res);
          swal({
            title: "Your order has been placed successfully",
            text: "You can check your orders on account page",
            icon: "success",
            button: "Ok",
          });
          setCart(null);
          navigate("/account");
        } else {
          console.log(res);
          console.log("something went wrong");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    document.title = props.title || "";
    getProducts();
  }, []);

  return (
    <>
      <div className="page">
        <h1 className="heading">Cart</h1>
        <div className="cart">
          <table className="table">
            <thead>
              <tr className="links">
                <th scope="col">Product</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            {products ? (
              <>
                <tbody>
                  {products.map((product) => {
                    return (
                      <tr>
                        <th scope="row">{product.name}</th>
                        <td scope="row">1</td>
                        <td scope="row">{product.price}$</td>
                      </tr>
                    );
                  })}
                </tbody>
              </>
            ) : (
              <>
                <tbody>No Products in cart</tbody>
              </>
            )}
          </table>
        </div>
        <h1 className="heading">Checkout</h1>
        <form
          onSubmit={(e) => {
            placeOrder(e);
          }}
        >
          <div className="form-outline mb-4">
            <input
              required
              type="text"
              id="form2Example1"
              className="form-control"
              placeholder="Name"
              ref={name}
            />
          </div>
          <div className="form-outline mb-4">
            <input
              required
              type="text"
              id="form2Example1"
              className="form-control"
              placeholder="Phone"
              ref={phone}
            />
          </div>

          <div className="form-outline mb-4">
            <input
              required
              type="text"
              id="form2Example1"
              className="form-control"
              placeholder="Address"
              ref={address}
            />
          </div>
          <p>
            <b>Payment Method: </b>Cash on delivery
          </p>
          <p>
            <b>Total: </b>
            {total}$
          </p>
          <div className="row mb-4">
            <div className="col">
              {" "}
              <button
                type="submit"
                className="btn btn-primary btn-block mb-4"
                style={{ width: 100 + "%" }}
              >
                Place Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
