import "./topbar.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../userContext";
import { CartContext } from "../../cartContext";

import { useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";

export default function Topbar() {
  const api = process.env.REACT_APP_API;

  const { usertop, setUsertop } = useContext(UserContext);
  const [isadmin, setIsadmin] = useState();

  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();
  const logout = () => {
    axios({
      method: "POST",
      withCredentials: true,
      url: `${api + "/logout"}`,
    })
      .then((res) => {
        if (res.status == 200) {
          setUsertop(null);
          setCart(null);
          setIsadmin(false);
          localStorage.user = null;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (usertop) {
      if (usertop.status == 1) {
        setIsadmin(true);
      }
    }
  }, [usertop]);

  if (isadmin) {
    return (
      <>
        {" "}
        {isadmin && (
          <>
            <div className="topbar">
              <div className="topLeft">
                <Link to="/">
                  <img width={150} src={logo} />
                </Link>
              </div>
              <div className="topMiddle">
                <ul className="topList">
                  <li className="topListItem">
                    <Link to="/admin/all-orders">direct orders</Link>
                  </li>
                  <li className="topListItem">
                    <Link to="/admin/all-auctions">auction orders</Link>
                  </li>
                  <li className="topListItem">
                    <Link to="/admin/all-products">all products</Link>
                  </li>
                  <li className="topListItem">
                    <Link to="/admin/categories">categories</Link>
                  </li>
                </ul>
              </div>
              <div className="topRight">
                {usertop ? (
                  <>
                    <p>welcome {usertop.username}</p>
                    <li
                      className="topListItem"
                      onClick={() => {
                        logout();
                      }}
                    >
                      logout
                    </li>
                  </>
                ) : (
                  <li className="topListItem">
                    <Link to="/login">login</Link>
                  </li>
                )}
              </div>
            </div>
          </>
        )}
      </>
    );
  } else {
    return (
      <>
        <div className="topbar">
          <div className="topLeft">
            <Link to="/">
              <img width={150} src={logo} />
            </Link>
          </div>
          <div className="topMiddle">
            <ul className="topList">
              <li className="topListItem">
                <Link to="/">home</Link>
              </li>
              <li className="topListItem">
                <Link to="/products">products</Link>
              </li>
              <li className="topListItem">
                <Link to="/categories">categories</Link>
              </li>

              {usertop && (
                <>
                  <li className="topListItem">
                    <Link to="/cart">cart</Link>
                  </li>
                  <li className="topListItem">
                    <Link to="/account">account</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="topRight">
            {usertop ? (
              <>
                <p>welcome {usertop.username}</p>
                <li
                  className="topListItem"
                  onClick={() => {
                    logout();
                  }}
                >
                  logout
                </li>
              </>
            ) : (
              <li className="topListItem">
                <Link to="/login">login</Link>
              </li>
            )}

            <i className="fa-solid fa-magnifying-glass topIconRight"></i>
          </div>
        </div>
        <div id="topCategoriesBlock">
          <ul id="topCategoriesUl">
            <li>
              <a href="#">Phones</a>
            </li>
            <li>
              <a href="#">Houses</a>
            </li>
            <li>
              <a href="#">Watches</a>
            </li>
            <li>
              <a href="#">Glasses</a>
            </li>
            <li>
              <a href="#">Games</a>
            </li>
            <li>
              <a href="#">Hardware</a>
            </li>
          </ul>
        </div>
      </>
    );
  }
}
