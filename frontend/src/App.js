import { UserContext } from "./userContext";
import { CartContext } from "./cartContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Topbar from "./components/topbar/Topbar";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Footer from "./components/footer/Footer";
import Products from "./pages/products/Products";
import Single_product from "./pages/single_product/Single_product";
import Categories from "./pages/categories/Categories";
import Single_category from "./pages/single_category/Single_category";
import Cart from "./pages/cart/Cart";
import Account from "./pages/account/Account";
import New_product from "./pages/new_product/New_product";
import Single_order from "./pages/single_order/Single_order";
import Single_auction from "./pages/single_auction/Single_auction";

// admin imports
import All_orders from "./admin/all_orders/All_orders";
import Admin_categories from "./admin/categories/Categories";
import All_auctions from "./admin/all_auctions/All_auctions";
import All_products from "./admin/all_products/All_products";

function App() {
  const [usertop, setUsertop] = useState(null);
  const [cart, setCart] = useState([]);
  const [isadmin, setIsadmin] = useState(null);
  const api = process.env.REACT_APP_API;

  const providerValue = useMemo(
    () => ({ usertop, setUsertop }),
    [usertop, setUsertop]
    // []
  );
  const providerValuesforcart = useMemo(
    () => ({ cart, setCart }),
    [cart, setCart]
  );

  // getting user data like name etc
  const getUser = () => {
    fetch(api + "/user", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.user) {
          console.log(res.user);
          setUsertop(res.user[0]);
        } else {
          console.log("user not found");
        }
      })

      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (usertop) {
      if (usertop.status == 1) {
        setIsadmin(true);
      }
    }
  }, [usertop]);

  if (isadmin != null) {
    return (
      <UserContext.Provider value={providerValue}>
        <CartContext.Provider value={providerValuesforcart}>
          <Router>
            {<Topbar usertop={usertop} />}
            <Routes>
              {/* -------- admin routes ---------- */}
              <Route path="/" exact element={<Home />} title="Home" />
              <Route
                path="/login"
                element={usertop ? <Navigate to="/" /> : <Login />}
                title="Login"
              />

              {/* ---------------admin routes----------------- */}
              <Route
                path="admin/all-orders"
                element={<All_orders />}
                title="All orders"
              />
              <Route
                path="admin/all-auctions"
                element={<All_auctions />}
                title="All auctions"
              />
              <Route
                path="admin/all-products"
                element={<All_products />}
                title="All products"
              />
              <Route
                path="admin/categories"
                element={<Admin_categories />}
                title="All categories"
              />
            </Routes>

            <Footer />
          </Router>
        </CartContext.Provider>
      </UserContext.Provider>
    );
  }

  if (usertop != null) {
    return (
      <UserContext.Provider value={providerValue}>
        <CartContext.Provider value={providerValuesforcart}>
          <Router>
            {<Topbar usertop={usertop} />}
            <Routes>
              {/* -------- admin routes ---------- */}
              <Route path="/" exact element={<Home />} title="Home" />
              <Route
                path="/login"
                element={usertop ? <Navigate to="/" /> : <Login />}
                title="Login"
              />

              <Route path="/products" element={<Products />} title="Products" />
              <Route
                path="/product/:productId"
                element={<Single_product />}
                title="Product"
              />

              <Route
                path="/categories"
                element={<Categories />}
                title="Categories"
              />
              <Route
                path="/category/:categoryId"
                element={<Single_category />}
                title="Category"
              />

              <Route
                path="/cart"
                element={usertop ? <Cart /> : <Navigate to="/login" />}
                title="Cart"
              />
              <Route
                path="/account"
                element={usertop ? <Account /> : <Navigate to="/login" />}
                title="Account"
              />

              <Route
                path="/add-new-product"
                element={usertop ? <New_product /> : <Navigate to="/login" />}
                title="New Product"
              />

              <Route
                path="/order/:orderId"
                element={usertop ? <Single_order /> : <Navigate to="/login" />}
                title="Order"
              />

              <Route
                path="/auction/:auctionId"
                element={
                  usertop ? <Single_auction /> : <Navigate to="/login" />
                }
                title="Auction"
              />
            </Routes>
            <Footer />
          </Router>
        </CartContext.Provider>
      </UserContext.Provider>
    );
  } else {
    return (
      <UserContext.Provider value={providerValue}>
        <CartContext.Provider value={providerValuesforcart}>
          <Router>
            {<Topbar usertop={usertop} />}
            <Routes>
              {/* -------- admin routes ---------- */}
              <Route path="/" exact element={<Home />} title="Home" />
              <Route path="/login" element={<Login />} title="Login" />

              <Route path="/products" element={<Products />} title="Products" />
              <Route
                path="/product/:productId"
                element={<Single_product />}
                title="Product"
              />

              <Route
                path="/categories"
                element={<Categories />}
                title="Categories"
              />
              <Route
                path="/category/:categoryId"
                element={<Single_category />}
                title="Category"
              />
            </Routes>

            <Footer />
          </Router>
        </CartContext.Provider>
      </UserContext.Provider>
    );
  }
}

export default App;
