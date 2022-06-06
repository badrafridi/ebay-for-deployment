import React from "react";
import "./footer.css";

export default function Footer() {
  return (
    <div className="footer">
      <div>
        <h3>Important Links</h3>
        <ul className="ulNoStyle">
          <li>
            <a href="">Page</a>
          </li>
          <li>
            <a href="">Page</a>
          </li>
          <li>
            <a href="">Page</a>
          </li>
          <li>
            <a href="">Page</a>
          </li>
          <li>
            <a href="">Page</a>
          </li>
        </ul>
      </div>
      <div>
        <h3>My Account</h3>
        <ul className="ulNoStyle">
          <li>
            <a href="">Profile</a>
          </li>
          <li>
            <a href="">Orders</a>
          </li>
          <li>
            <a href="">History</a>
          </li>
          <li>
            <a href="">My Products</a>
          </li>
        </ul>
      </div>
      <div>
        <h3>Categories</h3>
        <ul className="ulNoStyle">
          <li>
            <a href="">Iphone</a>
          </li>
          <li>
            <a href="">Watches</a>
          </li>
          <li>
            <a href="">Glasses</a>
          </li>
          <li>
            <a href="">Cars</a>
          </li>
          <li>
            <a href="">Houses</a>
          </li>
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
