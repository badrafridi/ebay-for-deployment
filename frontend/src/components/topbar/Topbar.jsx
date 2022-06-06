import "./topbar.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../userContext";
import { CartContext } from "../../cartContext";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";

export default function Topbar() {
  const api = process.env.REACT_APP_API;

  const { usertop, setUsertop } = useContext(UserContext);
  const [isadmin, setIsadmin] = useState();

  const { cart, setCart } = useContext(CartContext);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const getcategories = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: `${api + "/getallcategories"}`,
    })
      .then((res) => {
        setCategories(res.data.row);
      })
      .catch((error) => {
        console.log(error);
      });
  };
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
    getcategories();
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
            {categories &&
              categories.slice(0, 6).map((cat) => {
                return (
                  <>
                    <li>
                      <Link to={"/category/" + cat.id}>{cat.name}</Link>
                    </li>
                  </>
                );
              })}
          </ul>
        </div>
      </>
    );
  }
}
