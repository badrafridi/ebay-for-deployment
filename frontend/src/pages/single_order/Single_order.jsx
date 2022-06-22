import { useLocation } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import swal from "sweetalert";

import { UserContext } from "../../userContext";
import { CartContext } from "../../cartContext";

export default function Single_order() {
  const api = process.env.REACT_APP_API;

  const { usertop, setUsertop } = useContext(UserContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [orderdetails, setOrderdetails] = useState([]);
  const [buyer, setBuyer] = useState(false);
  const [seller, setSeller] = useState(false);
  const starOne = useRef("");
  const starTwo = useRef("");
  const starThree = useRef("");
  const starFour = useRef("");
  const starFive = useRef("");

  const getSingleorder = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: `${api + "/getproductsforcart/" + id}`,
    })
      .then((res) => {
        setOrderdetails(res.data.row[0]);
        console.log(res.data.row[0]);
        console.log(res.data.row[0].seller_id);
        console.log(usertop);
        console.log(usertop.id);
        if (res.data.row[0].seller_id == usertop.id) {
          setSeller(true);
          setBuyer(false);
        }
        if (res.data.row[0].buyer_id == usertop.id) {
          setBuyer(true);
          setSeller(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const markDelivered = (order_id) => {
    console.log(
      "mark as delivered function started with order id: " + order_id
    );
    axios({
      method: "POST",
      data: {
        order_id,
      },
      withCredentials: true,
      url: `${api + "/markasdelivered"}`,
    })
      .then((res) => {
        console.log(res);
        console.log("successfully delivered");
        if (res.data.message == "successfully delivered") {
          swal({
            title: "You have successfully marked the order as delivered.",
            text: "Customer can now accept the delivery to complete this order",
            icon: "success",
            button: "Ok",
          });
        }
        getSingleorder();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const orderReceived = (order_id) => {
    axios({
      method: "POST",
      data: {
        order_id,
      },
      withCredentials: true,
      url: `${api + "/markascompleted"}`,
    })
      .then((res) => {
        if (res.data.message == "order successfully completed") {
          swal({
            title: "You have successfully marked the order as completed.",
            text: "",
            icon: "success",
            button: "Ok",
          });
          getSingleorder();
        }
        getSingleorder();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const appeal = (id) => {
    axios({
      method: "POST",
      data: {
        id,
      },
      withCredentials: true,
      url: `${api + "/appeal"}`,
    })
      .then((res) => {
        console.log(res);
        console.log("appeal done");
        if (res.data.message == "appeal done") {
          swal({
            title: "Appeal to TheBay successfully done",
            text: "Appeal to TheBay successfully done",
            icon: "success",
            button: "Ok",
          });
        }
        getSingleorder();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changeColor = (e) => {
    e.target.classList.toggle("selected");
  };

  // rate the buyer or seller after order is completed
  const ratetheorder = () => {
    const ratingby = usertop.id;
    const sellerid = orderdetails.seller_id;
    const buyerid = orderdetails.buyer_id;

    // when user is seller
    if (ratingby == sellerid) {
      var totalRating = 0;
      if (starOne.current.checked) {
        totalRating++;
      }
      if (starTwo.current.checked) {
        totalRating++;
      }
      if (starThree.current.checked) {
        totalRating++;
      }
      if (starFour.current.checked) {
        totalRating++;
      }
      if (starFive.current.checked) {
        totalRating++;
      }

      axios({
        method: "POST",
        data: {
          totalRating,
          ratingby,
          id,
          buyerid,
          sellerid,
        },
        withCredentials: true,
        url: `${api + "/rateauserfororder"}`,
      })
        .then((res) => {
          if (res.data.message == "rating the buyer and everything done") {
            swal({
              title: "rating the buyer successfully done",
              text: "",
              icon: "success",
              button: "Ok",
            });
            getSingleorder();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // when user is buyer
    if (ratingby == buyerid) {
      var totalRating = 0;
      if (starOne.current.checked) {
        totalRating++;
      }
      if (starTwo.current.checked) {
        totalRating++;
      }
      if (starThree.current.checked) {
        totalRating++;
      }
      if (starFour.current.checked) {
        totalRating++;
      }
      if (starFive.current.checked) {
        totalRating++;
      }

      axios({
        method: "POST",
        data: {
          totalRating,
          ratingby,
          id,
          buyerid,
          sellerid,
        },
        withCredentials: true,
        url: `${api + "/rateauserfororder"}`,
      })
        .then((res) => {
          console.log("response received on else");
          console.log(res);
          if (res.data.message == "rating the seller and everything done") {
            swal({
              title: "rating the seller successfully done",
              text: "",
              icon: "success",
              button: "Ok",
            });
            getSingleorder();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    getSingleorder();
  }, []);
  return (
    <>
      <div className="page">
        <h2>Buyer Details</h2>

        <p>
          <b>Buyer name: </b>
          {orderdetails.buyer_name}
        </p>
        <p>
          <b>Buyer Phone: </b>
          {orderdetails.buyer_phone}
        </p>
        <p>
          <b>Buyer Address: </b>
          {orderdetails.buyer_address}
        </p>

        <h2>Seller Details</h2>
        <p>
          <b>Seller Name: </b>
          {orderdetails.seller_name}
        </p>

        <h2>Product Details</h2>
        <p>
          <b>Product Name: </b>
          {orderdetails.product_name}
        </p>
        <p>
          <b>Product Price: </b>
          {orderdetails.product_price}
        </p>
        <h2>Order Details</h2>
        <p>
          <b>Status: </b>
          {orderdetails.status}
        </p>
        <p>
          <b>Order Placed on: </b>
          {orderdetails.date}
        </p>

        {orderdetails.status == "appeal" ? (
          <>
            Buyer appealed to the admin about the order. Please wait for further
            notice from admin.
          </>
        ) : (
          <>
            {" "}
            {buyer ? (
              <>
                {orderdetails.status == "delivered" ? (
                  <>
                    <button
                      onClick={() => {
                        orderReceived(id);
                      }}
                      className="btn btn-primary btn-block mb-4"
                    >
                      Received
                    </button>
                  </>
                ) : orderdetails.status == "pending" ? (
                  <>Please wait for the seller to deliver the order</>
                ) : (
                  <>
                    {orderdetails.rated_by_buyer ? (
                      <>
                        {" "}
                        <p className="green">
                          The order is completed and you have rated the seller.
                          thank you
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="green">
                          the order is completed you can now rate the seller
                        </p>
                        <label for="star-one">
                          <i
                            class="fa-solid fa-star star-one"
                            onClick={(e) => {
                              changeColor(e);
                            }}
                          ></i>
                        </label>
                        <input
                          type="checkbox"
                          id="star-one"
                          ref={starOne}
                          style={{ display: "none" }}
                        ></input>

                        <label for="star-two">
                          <i
                            class="fa-solid fa-star star-two"
                            onClick={(e) => {
                              changeColor(e);
                            }}
                          ></i>
                        </label>
                        <input
                          type="checkbox"
                          id="star-two"
                          ref={starTwo}
                          style={{ display: "none" }}
                        ></input>

                        <label for="star-three">
                          <i
                            class="fa-solid fa-star star-three"
                            onClick={(e) => {
                              changeColor(e);
                            }}
                          ></i>
                        </label>
                        <input
                          type="checkbox"
                          id="star-three"
                          ref={starThree}
                          style={{ display: "none" }}
                        ></input>

                        <label for="star-four">
                          <i
                            class="fa-solid fa-star star-four"
                            onClick={(e) => {
                              changeColor(e);
                            }}
                          ></i>
                        </label>
                        <input
                          type="checkbox"
                          id="star-four"
                          ref={starFour}
                          style={{ display: "none" }}
                        ></input>

                        <label for="star-five">
                          <i
                            class="fa-solid fa-star star-five"
                            onClick={(e) => {
                              changeColor(e);
                            }}
                          ></i>
                        </label>
                        <input
                          type="checkbox"
                          id="star-five"
                          ref={starFive}
                          style={{ display: "none" }}
                        ></input>

                        <button
                          onClick={(e) => {
                            ratetheorder(e);
                          }}
                        >
                          Submit
                        </button>
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                {seller && orderdetails.status == "pending" ? (
                  <>
                    <p className="red">
                      Please deliver this order as soon as possible.
                    </p>
                    <button
                      onClick={() => {
                        markDelivered(id);
                      }}
                      className="btn btn-primary btn-block mb-4"
                    >
                      Mark as delivered
                    </button>
                  </>
                ) : orderdetails.status == "delivered" ? (
                  <>
                    {" "}
                    <p className="green">
                      Order submitted as delivered. please wait for the customer
                      to accept.
                    </p>
                  </>
                ) : (
                  <>
                    {orderdetails.rated_by_seller ? (
                      <>
                        <p className="green">
                          The order is completed and you have rated the buyer.
                          thank you
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="green">
                          the order is completed you can now rate the buyer
                        </p>
                        <label for="star-one">
                          <i
                            class="fa-solid fa-star star-one"
                            onClick={(e) => {
                              changeColor(e);
                            }}
                          ></i>
                        </label>
                        <input
                          type="checkbox"
                          id="star-one"
                          ref={starOne}
                          style={{ display: "none" }}
                        ></input>

                        <label for="star-two">
                          <i
                            class="fa-solid fa-star star-two"
                            onClick={(e) => {
                              changeColor(e);
                            }}
                          ></i>
                        </label>
                        <input
                          type="checkbox"
                          id="star-two"
                          ref={starTwo}
                          style={{ display: "none" }}
                        ></input>

                        <label for="star-three">
                          <i
                            class="fa-solid fa-star star-three"
                            onClick={(e) => {
                              changeColor(e);
                            }}
                          ></i>
                        </label>
                        <input
                          type="checkbox"
                          id="star-three"
                          ref={starThree}
                          style={{ display: "none" }}
                        ></input>

                        <label for="star-four">
                          <i
                            class="fa-solid fa-star star-four"
                            onClick={(e) => {
                              changeColor(e);
                            }}
                          ></i>
                        </label>
                        <input
                          type="checkbox"
                          id="star-four"
                          ref={starFour}
                          style={{ display: "none" }}
                        ></input>

                        <label for="star-five">
                          <i
                            class="fa-solid fa-star star-five"
                            onClick={(e) => {
                              changeColor(e);
                            }}
                          ></i>
                        </label>
                        <input
                          type="checkbox"
                          id="star-five"
                          ref={starFive}
                          style={{ display: "none" }}
                        ></input>

                        <button
                          onClick={(e) => {
                            ratetheorder(e);
                          }}
                        >
                          Submit
                        </button>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
        {buyer && (
          <>
            <button
              onClick={(id) => {
                appeal(id);
              }}
            >
              Appeal
            </button>
          </>
        )}
      </div>
    </>
  );
}
