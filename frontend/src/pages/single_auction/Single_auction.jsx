import { useLocation } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import swal from "sweetalert";
import "./single_auction.css";

import { UserContext } from "../../userContext";
import { CartContext } from "../../cartContext";

export default function Single_auction() {
  const api = process.env.REACT_APP_API;
  const reactapp = process.env.REACT_APP;


  const { usertop, setUsertop } = useContext(UserContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [buyer, setBuyer] = useState(false);
  const [auctiondetails, setAuctiondetails] = useState([]);
  const [lastbiddername, setLastbiddername] = useState("");
  const [owner, setOwner] = useState(false);
  const starOne = useRef("");
  const starTwo = useRef("");
  const starThree = useRef("");
  const starFour = useRef("");
  const starFive = useRef("");

  const getAuctionDetails = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: `${api + "/allsingleauctiondetailstwo/" + id}`,
    })
      .then((res) => {
        if (res.data.message == "here are the auction details") {
          setAuctiondetails(res.data.row[0]);
          lastBidder(res.data.row[0].last_bidder_id);
          if (res.data.row[0].user_id == usertop.id) {
            console.log("yes this is the owner");
            setOwner(true);
            setBuyer(false);
          }
          if (res.data.row[0].last_bidder_id == usertop.id) {
            console.log("yes this is the buyer");
            setBuyer(true);
            setOwner(false);
          }
        } else {
          console.log("this is direct product");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // get last bidder info (username)
  const lastBidder = (idx) => {
    axios({
      method: "POST",
      data: { idx },
      withCredentials: true,
      url: `${api + "/getuserwithuserid"}`,
    })
      .then((res) => {
        console.log("from last bidder function");
        console.log(res);
        setLastbiddername(res.data.row[0].username);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //   mark the auction product delivered by seller
  const markasdelivered = () => {
    console.log("mark delivered func running");
    axios({
      method: "POST",
      data: {
        id,
      },
      withCredentials: true,
      url: `${api + "/markauctionasdelivered"}`,
    })
      .then((res) => {
        if (res.data.message == "auction order successfully delivered") {
          swal({
            title: "You have successfully marked the order as delivered.",
            text: "Customer can now accept the delivery to complete this order",
            icon: "success",
            button: "Ok",
          });
        }
        getAuctionDetails();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //   mark the auction product status as completed or received
  const markascompleted = () => {
    if (usertop.id == auctiondetails.last_bidder_id) {
      axios({
        method: "POST",
        data: {
          id,
        },
        withCredentials: true,
        url: `${api + "/markauctionascompleted"}`,
      })
        .then((res) => {
          if (res.data.message == "auction order successfully completed") {
            swal({
              title: "You have successfully marked the order as completed.",
              text: "",
              icon: "success",
              button: "Ok",
            });
          }
          getAuctionDetails();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("can not send request as you are not the original buyer");
    }
  };

  const changeColor = (e) => {
    console.log("change color runnning");
    console.log(e.target);
    e.target.classList.toggle("selected");
  };

  // rate the buyer or seller after order is completed
  const ratethebuyer = () => {
    const ratingby = usertop.id;
    const sellerid = auctiondetails.user_id;
    const buyerid = auctiondetails.last_bidder_id;

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
        url: `${api + "/rateauserforauction"}`,
      })
        .then((res) => {
          if (res.data.message == "rating the buyer and everything done") {
            swal({
              title: "rating the buyer successfully done",
              text: "",
              icon: "success",
              button: "Ok",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // when user is buyer
    if (ratingby == buyerid) {
      console.log("hello yes i am the buyer");
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
        url: `${api + "/rateauserforauction"}`,
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
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    getAuctionDetails();
  }, []);
  return (
    <>
      <div className="page">
        <h2>Product Details</h2>
        <p>
          <b>Product Name: </b>
          {auctiondetails.product_name}
        </p>
        <p>
          <b>Product Description: </b>
          {auctiondetails.end_date}
        </p>
        <p>
          <b>Product Seller: </b>
          {auctiondetails.seller}
        </p>
        <p>
          <b>Product Original Price: </b>
          {auctiondetails.original_price}
        </p>
        <p>
          <b>Product Status: </b>
          {auctiondetails.status == "sold" ? (
            <>
              <span
                className="green"
                style={{ display: "inline-block", marginBottom: "0px" }}
              >
                Sold
              </span>
            </>
          ) : (
            <>
              <span
                className="red"
                style={{ display: "inline-block", marginBottom: "0px" }}
              >
                Not sold
              </span>
            </>
          )}
        </p>
        <h2>Auction Details</h2>

        <p>
          <b>Auction Ending Date: </b>
          {auctiondetails.end_date}
        </p>

        <p>
          <b>Last Bid: </b>
          {auctiondetails.last_bid}
        </p>
        <p>
          <b>Last Bidder: </b>
          {lastbiddername}
        </p>
        <p>
          <b>Buyer Address: </b>
          {auctiondetails.address}
        </p>
        <br></br>
        <br></br>

        {/* {auctiondetails.status == "not sold" && (
          
        )} */}

        {owner && owner ? (
          <>
            {auctiondetails.status == "sold" ? (
              auctiondetails.auction_status == "pending" ? (
                <>
                  <p>You can now deliver the order</p>
                  <button
                    onClick={() => {
                      markasdelivered();
                    }}
                  >
                    Mark as Delivered
                  </button>
                </>
              ) : (
                <>
                  {auctiondetails.auction_status == "completed" ? (
                    <>
                      {auctiondetails.rated_by_seller ? (
                        <>
                          <p className="green">
                            This order is completed, you are the seller
                          </p>
                          You have rated the buyer. thank you for your feedback.
                        </>
                      ) : (
                        <>
                          <p className="green">
                            This order is completed, you are the seller
                          </p>
                          <p>you can now rate the buyer</p>
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
                              ratethebuyer(e);
                            }}
                          >
                            Submit
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <>
                        <p className="green">
                          Order is delivered, please wait for the buyer to
                          accept the delivery
                        </p>
                      </>
                    </>
                  )}
                </>
              )
            ) : (
              <>
                <p className="red">Please wait for the Auction time to end</p>
              </>
            )}
          </>
        ) : buyer ? (
          <>
            {auctiondetails.status == "not sold" ? (
              <>Please wait for the auction time to end.</>
            ) : (
              <>
                {auctiondetails.auction_status == "pending" ? (
                  <>Please wait for the seller to mark the order as delivered</>
                ) : auctiondetails.auction_status == "delivered" ? (
                  <>
                    order marked as delivered by the seller. if you have
                    received your product you should mark the order as
                    completed.
                    <br></br>
                    <button
                      onClick={() => {
                        markascompleted();
                      }}
                    >
                      Mark as complete
                    </button>
                  </>
                ) : (
                  <>
                    {auctiondetails.rated_by_buyer ? (
                      <>
                        <p className="green">
                          This order is completed, you are the buyer
                        </p>
                        you have rated the seller, thank you for the feed back
                      </>
                    ) : (
                      <>
                        <p className="green">
                          This order is completed, you are the buyer
                        </p>
                        <p>you can now rate the seller</p>
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
                            ratethebuyer(e);
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
        ) : (
          <>Nothing to show here sorry</>
        )}

        {/* {buyer ? (<> {orderdetails.status == "delivered" ? (<><button onClick={()=>{
                    orderReceived(orderdetails.id);
                }} className="btn btn-primary btn-block mb-4">Received</button></>) : orderdetails.status=="pending" ? (<>Please wait for the seller to deliver the order</>) : (<>The order is completed</>)}
                
                </>) : (<>{orderdetails.status == "delivered" ? <p className="green">Order submitted as delivered. please wait for the customer to accept.</p> :  (<><p className="red">Please deliver this order as soon as possible.</p><button onClick={()=>{
                    markDelivered(orderdetails.id);
                }} className="btn btn-primary btn-block mb-4">Mark as delivered</button></>)}</>) } */}
      </div>
    </>
  );
}
