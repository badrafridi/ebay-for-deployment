import { useState, useEffect, useContext, useRef } from "react";
import "./single_product.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserContext } from "../../userContext";
import { CartContext } from "../../cartContext";
import swal from "sweetalert";

export default function Single_product() {
  const api = process.env.REACT_APP_API;
  const [loading, setLoading] = useState(true)

  const { usertop, setUsertop } = useContext(UserContext);
  const { cart, setCart } = useContext(CartContext);
  const [product, setProduct] = useState([]);
  const [auctiondetails, setAuctiondetails] = useState([]);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [error, setError] = useState();
  const [timepassed, setTimepassed] = useState(false);
  const [soldout, setSoldout] = useState(false);
  const bid = useRef(0);
  const address = useRef();
  const [userrating, setUserrating] = useState();


  const getUserrating = (user_id) => {
    axios({
      method: "POST",
      data: {
        user_id,
      },
      withCredentials: true,
      url: `${api + "/getuserrating"}`,
    })
      .then((res) => {
        console.log(res);
        var no_of_ratings = res.data.row[0].no_of_ratings;
        var total_rating = res.data.row[0].rating;
        var finalRating = total_rating / no_of_ratings;
        finalRating = finalRating.toFixed(2);
        setUserrating(finalRating);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getProduct = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: `${api + "/allsingleproduct/" + id}`,
    })
      .then((res) => {
        setProduct(res.data.row[0]);
        getUserrating(res.data.row[0].user_id);
        if (res.data.row[0].status === "sold") {
          setSoldout(true);
        }
        if (res.data.row[0].type === "direct") {
          setLoading(false)
        }
        if (res.data.row[0].type === "auction") {
          // var x = res.data.row[0].end_date;
          // if (new Date(x).toLocaleString() < new Date().toLocaleString()) {
          //   console.log("auction time has passed");
          //   setTimepassed(true);
          // }
          getAuctionDetails();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAuctionDetails = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: `${api + "/allsingleauctiondetails/" + id}`,
    })
      .then((res) => {
        if (res.data.message === "here are the auction details") {
          console.log(res);
          setAuctiondetails(res.data.row[0]);
          setLoading(false)
          var x = res.data.row[0].end_date;
          if (new Date(x) < new Date()) {
            console.log("auction time has passed");
            setTimepassed(true);
          }
        } else {
          console.log("this is direct product");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const placeBid = () => {
    const bidx = bid.current.value;
    const product_id = product.id;
    const addressx = address.current.value;
    if (auctiondetails.last_bid >= bidx) {
      setError("please place order price more than old auction");
    } else {
      axios({
        method: "PUT",
        withCredentials: true,
        data: { bidx, product_id, addressx },
        url: `${api + "/placebid"}`,
      })
        .then((res) => {
          if (res.data.message === "new bid successfully added") {
            console.log(res);
            getProduct();
            document.getElementById("bid").value = "";
            document.getElementById("address").value = "";

            swal({
              title: "Bid successfully placed",
              text: "you can check the bid status on your account page.",
              icon: "success",
              button: "Ok",
            });
            setError("");
            getAuctionDetails();
          } else {
            setError("something went wrong, try again later. or check console");
            console.log(res);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const addtocart = () => {
    console.log(typeof cart);
    if (cart != null) {
      var alreadyincart = cart.includes(product.id);
      if (alreadyincart) {
        setError("cannot add product to cart. product already in cart");
      } else {
        arr = [...cart];
        arr.push(product.id);
        setCart(arr);
        setError("");
        swal({
          title: "Product added to cart successfully",
          text: "you can see this product in your cart",
          icon: "success",
          button: "Ok",
        });
      }
    } else {
      var arr = [product.id];
      setCart(arr);
      swal({
        title: "Product added to cart successfully",
        text: "you can see this product in your cart",
        icon: "success",
        button: "Ok",
      });
    }
  };

  useEffect(() => {
    getProduct();
  }, []);
  return (
    <> {loading ? (<><div class="loaderContainer arc"></div></>) : 
    (<>      <div className="page">
      <div className="flexRow twoColumns">
        <div className="flexColumn full productPageProductImageBlock">
          <img src={product.url ? product.url.replace('.jpg','.webp').replace('.jpeg','.webp').replace('.png','.webp') : ""}></img>
        </div>
        <div className="flexColumn full productPageProductDetailsBlock">
          <p style={{ fontSize: "14px" }}>
            <b>Category: </b>
            <Link to={"/category/" + product.category_id}>
              {product.category_name}
            </Link>
          </p>
          <h3 style={{ fontSize: "34px" }}>{product.name}</h3>
          <p>User average rating: {userrating}/5</p>
          <h3 style={{ fontSize: "21px" }}>Price: {product.price}</h3>
          <p>{product.description}</p>
          <p>
            <b>Buying Method: </b>
            {product.type}
          </p>
          {product.type == "direct" ? (
            <>
              {!usertop ? (
                <>Please login to add product to the cart</>
              ) : usertop.id == product.user_id ? (
                <>You can not place an order on your own product</>
              ) : soldout ? (
                <>
                  <p className="red">Sorry this product is sold out</p>
                </>
              ) : (
                <input
                  type="submit"
                  value="Add to Cart"
                  className="btn btn-primary btn-block mb-4"
                  onClick={(e) => {
                    addtocart(e);
                  }}
                ></input>
              )}

              <p
                className="error"
                style={{ color: "red", marginTop: "10px" }}
              >
                {error}
              </p>
            </>
          ) : (
            <>
              {timepassed ? (
                <>
                  <p className="red">
                    Sorry, auction time has ended on{" "}
                    {new Date(auctiondetails.end_date).toLocaleString()}
                  </p>
                </>
              ) : (
                <>
                  <b>Last bid: </b>
                  {auctiondetails.last_bid}
                  <br />
                  <b>Bid ending time: </b>
                  {new Date(auctiondetails.end_date).toLocaleString()}
                  <br />
                  <b>Last bidder name: </b>
                  {auctiondetails.username}
                  <br />
                  <div
                    className="form-outline mb-4"
                    style={{ marginTop: "30px" }}
                  >
                    <input
                      type="number"
                      id="bid"
                      placeholder="Your Bid"
                      className="form-control"
                      ref={bid}
                    ></input>
                  </div>
                  <div
                    className="form-outline mb-4"
                    style={{ marginTop: "30px" }}
                  >
                    <textarea
                      id="address"
                      placeholder="Your Address"
                      className="form-control"
                      ref={address}
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <input
                      style={{ width: "100%" }}
                      type="submit"
                      value="Place Bid"
                      className="btn btn-primary btn-block mb-4"
                      onClick={() => {
                        placeBid();
                      }}
                    ></input>
                    <p className="red">{error}</p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flexRow twoColumns"></div>
      <div className="flexRow twoColumns"></div>
    </div></>)}

    </>
  );
}
