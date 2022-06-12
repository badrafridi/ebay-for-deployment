import { useState, useEffect, useContext } from "react";
import "./footer.css";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Footer() {
  const api = process.env.REACT_APP_API;
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    getcategories();
  }, []);

  return (
    <div className="footer">
      <div>
        <h3>Important Links</h3>
        <ul className="ulNoStyle">
          <li>
            <Link to="/products">All Products</Link>
          </li>
          <li>
            <Link to="/categories">Categories</Link>
          </li>
          <li>
            <Link to="/cart">Cart</Link>
          </li>
          <li>
            <Link to="/account">Account</Link>
          </li>
        </ul>
      </div>
      <div>
        <h3>My Account</h3>
        <ul className="ulNoStyle">
          <li>
            <Link to="/account">Profile</Link>
          </li>
          <li>
            <Link to="/account">Orders</Link>
          </li>
          <li>
            <Link to="/account">History</Link>
          </li>
          <li>
            <Link to="/account">My Products</Link>
          </li>
        </ul>
      </div>
      <div>
        <h3>Categories</h3>
        <ul className="ulNoStyle">
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
      <div>
        <h3>Contact Us</h3>
        <ul className="ulNoStyle">
          <li>0352258924</li>
          <li>Peshawar, Pakistan</li>
          <li>Support@ebay.com</li>
        </ul>
      </div>
    </div>
  );
}
