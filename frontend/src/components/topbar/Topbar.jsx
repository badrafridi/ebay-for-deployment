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
            <div className="topbar" id="desktopHeader">
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
                    <p>Welcome {usertop.username}</p>
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
        {/* ------------------------------mobile header------------------------------ */}
        <header id="mobileHeader">
          <nav>
            <div class="log-container-mob">
              <Link to="/" class="logo-mob">
                <img width={150} src={logo} />
              </Link>
            </div>
            <div>
              <Link to="/products">
                <i class="fa-solid fa-magnifying-glass myIcon"></i>
              </Link>
            </div>
            <input type="checkbox" id="check-mob" />
            <label for="check-mob" class="hamburger-btn-mob">
              <i class="fas fa-bars myIcon"></i>
            </label>
            <ul class="nav-list-mob">
              {usertop && (
                <>
                  <li>Welcome {usertop.username}</li>
                </>
              )}
              <li>
                <Link to="/admin/all-orders">direct orders</Link>
              </li>
              <li>
                <Link to="/admin/all-auctions">auction orders</Link>
              </li>
              <li>
                <Link to="/admin/all-products">all products</Link>
              </li>
              <li>
                <Link to="/admin/categories">categories</Link>
              </li>
              {usertop ? (
                <>
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
            </ul>
          </nav>
        </header>
      </>
    );
  } else {
    return (
      <>
        <div className="topbar" id="desktopHeader">
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
                <p>Welcome {usertop.username}</p>
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
            <Link to="/products">
              <i className="fa-solid fa-magnifying-glass topIconRight"></i>
            </Link>
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

        {/* ------------------------------mobile header------------------------------ */}
        <header id="mobileHeader">
          <nav>
            <div class="log-container-mob">
              <Link to="/" class="logo-mob">
                <img width={150} src={logo} />
              </Link>
            </div>
            <div>
              <Link to="/products" onClick={() => {
              var x = document.getElementById("check-mob");
              x.checked = false;
            }}>
                <i class="fa-solid fa-magnifying-glass myIcon"></i>
              </Link>
            </div>
            <input type="checkbox" id="check-mob" />
            <label for="check-mob" class="hamburger-btn-mob">
              <i class="fas fa-bars myIcon"></i>
            </label>
            <ul class="nav-list-mob">
              {usertop && (
                <>
                  <li>Welcome {usertop.username}</li>
                </>
              )}
              <li>
                <Link to="/products" onClick={() => {
              var x = document.getElementById("check-mob");
              x.checked = false;
            }}>products</Link>
              </li>
              <li>
                <Link to="/categories" onClick={() => {
              var x = document.getElementById("check-mob");
              x.checked = false;
            }}>categories</Link>
              </li>
              {usertop && (
                <>
                  <li>
                    <Link to="/cart" onClick={() => {
              var x = document.getElementById("check-mob");
              x.checked = false;
            }}>cart</Link>
                  </li>
                  <li>
                    <Link to="/account" onClick={() => {
              var x = document.getElementById("check-mob");
              x.checked = false;
            }}>account</Link>
                  </li>
                </>
              )}
              {usertop ? (
                <>
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
                  <Link to="/login" onClick={() => {
              var x = document.getElementById("check-mob");
              x.checked = false;
            }}>login</Link>
                </li>
              )}
            </ul>
          </nav>
        </header>
      </>
    );
  }
}
