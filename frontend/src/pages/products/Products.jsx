import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Products() {
  const api = process.env.REACT_APP_API;
  const [allproducts, setAllproducts] = useState([]);

  const allProducts = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: `${api + "/allproducts"}`,
    })
      .then((res) => {
        setAllproducts(res.data.row);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    allProducts();
  }, []);
  return (
    <>
      <div className="page">
        <h1 className="heading">Products</h1>
        <div className="homeProductsBlock">
          {allproducts.map((product) => {
            return (
              <div className="homeProductsSingle" key={product.id}>
                <Link to={"/product/" + product.id}>
                  {" "}
                  <img
                    className="productImage"
                    src={"/images/" + product.url}
                  ></img>
                  <h4 className="productTitle">{product.name}</h4>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
