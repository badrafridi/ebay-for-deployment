import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import "./account.css";
import { UserContext } from "../../userContext";

export default function Account() {
  const api = process.env.REACT_APP_API;
  const [userproducts, setUserproducts] = useState([]);
  const [buyingorders, setBuyingorders] = useState([]);
  const [buyingauctionorders, setBuyingauctionorders] = useState([]);
  const [sellingdirectorders, setSellingdirectorders] = useState([]);
  const [sellingauctionorders, setSellingauctionorders] = useState([]);
  const { usertop, setUsertop } = useContext(UserContext);

  const getSingleUserProducts = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: `${api + "/allproductsofuser"}`,
    })
      .then((res) => {
        setUserproducts(res.data.row);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUserOrders = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: `${api + "/userorders"}`,
    })
      .then((res) => {
        setBuyingorders(res.data.row);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteProduct = (id) => {
    axios({
      method: "DELETE",
      data: {
        id,
      },
      withCredentials: true,
      url: `${api + "/deleteproduct"}`,
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
        }
      })
      .catch((error) => {
        swal({
          icon: "error",
          title: "Oops...",
          text: "Can not delete a product while it is in order",
          button: "Ok, sorry",
        });
      });
  };

  const getSellingorders = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: `${api + "/usersellingorders"}`,
    })
      .then((res) => {
        setSellingdirectorders(res.data.row);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // get selling auction orders
  const getAuctionorders = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: `${api + "/userauctionsellingorders"}`,
    })
      .then((res) => {
        setSellingauctionorders(res.data.row);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // get buying auction orders
  const getBuyingAuctionorders = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: `${api + "/userauctionbuyingorders"}`,
    })
      .then((res) => {
        console.log(res.data.row);
        setBuyingauctionorders(res.data.row);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getSingleUserProducts();
    getUserOrders();
    getSellingorders();
    getAuctionorders();
    getBuyingAuctionorders();
  }, []);
  const [tab, setTab] = useState("buying");
  return (
    <>
      <div className="page">
        <h1 className="heading">Account</h1>
        <div className="accountDetails">
          <p>
            <b>Name: </b>
            {usertop && usertop.username}
          </p>
        </div>
        <div className="tab">
          <div
            className="tabs"
            onClick={() => {
              setTab("buying");
            }}
          >
            <h4>Buying</h4>
          </div>
          <div
            className="tabs"
            onClick={() => {
              setTab("selling");
            }}
          >
            <h4>Selling</h4>
          </div>
        </div>
        {tab == "buying" ? (
          <>
            <h2 className="heading">Direct Buying Orders</h2>
            <div className="feeBlocks buyingOrders tableHead">
              <div className="first fifty">Product</div>
              <div className="second">Price</div>
              <div className="third">Date</div>
              <div className={"fourth "}>Status</div>
            </div>
            {buyingorders &&
              buyingorders.map((x) => {
                return (
                  <Link
                    to={"/order/" + x.id}
                    className="feeBlocks buyingOrders"
                  >
                    <div className="first fifty">
                      <img
                        className="accountProductImage"
                        src={x.url
                          .replace(".jpg", ".webp")
                          .replace(".jpeg", ".webp")
                          .replace(".png", ".webp")}
                      ></img>
                      <h4>{x.name}</h4>
                    </div>
                    <div className="second">{x.price}</div>
                    <div className="third">{x.date}</div>
                    <div
                      className={
                        x.status == "completed"
                          ? "fourth green"
                          : x.status == "pending"
                          ? "fourth red"
                          : "fourth grey"
                      }
                    >
                      {x.status == "delivered" ? (
                        <>marked as delivered by seller</>
                      ) : (
                        <>{x.status}</>
                      )}
                    </div>
                  </Link>
                );
              })}
            <h2 className="heading">Auction Buying Orders</h2>
            <div className="feeBlocks buyingAuctionOrders tableHead">
              <div className="first fifty">Product</div>
              <div className="second">Price</div>
              <div className="third">Date</div>
              <div className={"fourth "}>Auction Status</div>
              <div className={"fifth "}>Product Status</div>
            </div>
            {buyingauctionorders &&
              buyingauctionorders.map((x) => {
                return (
                  <Link
                    to={"/auction/" + x.auction_id}
                    className="feeBlocks buyingAuctionOrders"
                  >
                    <div className="first fifty">
                      <img
                        className="accountProductImage"
                        src={x.url
                          .replace(".jpg", ".webp")
                          .replace(".jpeg", ".webp")
                          .replace(".png", ".webp")}
                      ></img>
                      <h4>{x.product_name}</h4>
                    </div>
                    <div className="second">{x.price}</div>
                    <div className="third">{x.end_date}</div>
                    <div
                      className={
                        x.status == "completed"
                          ? "fourth green"
                          : x.status == "pending"
                          ? "fourth red"
                          : "fourth grey"
                      }
                    >
                      {x.auction_status}
                    </div>
                    <div className="fifth">{x.product_status}</div>
                  </Link>
                );
              })}
          </>
        ) : (
          <>
            <div className="flexRow twoColumns">
              <h2 className="heading">My Products</h2>
              <Link to="/add-new-product">
                <button>Add new Product</button>
              </Link>
            </div>

            <div className="feeBlocks tableHead myProducts">
              <div className="first fifty">Product</div>
              <div className="second">Price</div>
              <div className="third">Type</div>
              <div className="fourth">Status</div>
              <div className="fifth icons">Actions</div>
            </div>
            {userproducts &&
              userproducts.map((product) => {
                return (
                  <>
                    <div className="feeBlocks myProducts" id={product.id}>
                      <div className="first fifty">
                        <img
                          className="accountProductImage"
                          src={product.url
                            .replace(".jpg", ".webp")
                            .replace(".jpeg", ".webp")
                            .replace(".png", ".webp")}
                        ></img>
                        <h4>{product.name}</h4>
                      </div>
                      <div className="second">{product.price}$</div>
                      <div className="third">{product.type}</div>
                      <div className="fourth">{product.status}</div>
                      <div className="fifth icons">
                        <i
                          className="fa fa-trash"
                          aria-hidden="true"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this product?"
                              )
                            ) {
                              deleteProduct(product.id);
                            }
                          }}
                        ></i>
                      </div>
                    </div>
                  </>
                );
              })}

            <div className="flexRow twoColumns">
              <h2 className="heading">Direct Selling Orders</h2>
            </div>
            <div className="feeBlocks tableHead sellingbuyingorders">
              <div className="first fifty">
                <h4>Product</h4>
              </div>
              <div className="second">Price</div>
              <div className="third">By</div>
              <div className="fourth ">Type</div>
              <div className="fifth">Status</div>
            </div>
            {sellingdirectorders &&
              sellingdirectorders.map((order) => {
                return (
                  <>
                    <Link
                      to={"/order/" + order.id}
                      className="feeBlocks sellingbuyingorders"
                    >
                      <div className="first fifty">
                        <img
                          className="accountProductImage"
                          src={order.url
                            .replace(".jpg", ".webp")
                            .replace(".jpeg", ".webp")
                            .replace(".png", ".webp")}
                        ></img>
                        <h4>{order.name}</h4>
                      </div>
                      <div className="second">{order.price}</div>
                      <div className="third">{order.buyer_name}</div>
                      <div className="fourth ">{order.type}</div>
                      <div
                        className={
                          order.status == "completed"
                            ? "fifth green"
                            : order.status == "pending"
                            ? "fifth red"
                            : "fifth grey"
                        }
                      >
                        {order.status}
                      </div>
                    </Link>
                  </>
                );
              })}

            <div className="flexRow twoColumns">
              <h2 className="heading">Auction Selling Orders</h2>
            </div>
            <div className="feeBlocks tableHead sellingAuctionOrders">
              <div className="first fifty">
                <h4>Product</h4>
              </div>
              <div className="second">Price</div>
              <div className="third">By</div>
              <div className="fifth">Last Bid</div>
              <div className="sixth">End Date</div>
              <div className="seventh">Status</div>
            </div>
            {sellingauctionorders &&
              sellingauctionorders.map((order) => {
                return (
                  <>
                    <Link
                      to={"/auction/" + order.auction_id}
                      className="feeBlocks sellingOrders"
                    >
                      <div className="first fifty">
                        <img
                          className="accountProductImage"
                          src={order.url
                            .replace(".jpg", ".webp")
                            .replace(".jpeg", ".webp")
                            .replace(".png", ".webp")}
                        ></img>
                        <h4>{order.product_name}</h4>
                      </div>
                      <div className="second">{order.price}</div>
                      <div className="third">{order.username}</div>
                      <div className="fifth ">{order.last_bid}</div>
                      <div className="fifth ">{order.end_date}</div>
                      <div
                        className={
                          order.status == "sold"
                            ? "seventh green"
                            : order.status == "not sold"
                            ? "seventh red"
                            : "seventh grey"
                        }
                      >
                        {order.status}
                      </div>
                    </Link>
                  </>
                );
              })}
          </>
        )}
      </div>
    </>
  );
}
