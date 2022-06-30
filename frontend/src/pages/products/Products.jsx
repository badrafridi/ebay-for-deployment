import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Products() {
  const api = process.env.REACT_APP_API;
  const [search, setSearch] = useState("");

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
        <div class="input-group rounded" style={{ marginBottom: "20px" }}>
          <input
            type="search"
            class="form-control rounded"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="search-addon"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <span class="input-group-text border-0" id="search-addon">
            <i class="fas fa-search"></i>
          </span>
        </div>
        <div className="homeProductsBlock">
          {allproducts &&
            allproducts
              .filter((value) => {
                console.log(value.name.toLowerCase());
                if (search == "") {
                  return value;
                } else if (
                  value.name.toLowerCase().includes(search.toLowerCase())
                ) {
                  return value;
                }
                console.log(value.name);
                // return value;
              })
              .map((product) => {
                return (
                  <div className="homeProductsSingle" key={product.id}>
                    <Link to={"/product/" + product.id}>
                      {" "}
                      <img className="productImage" src={product.url.replace('.jpg','.webp').replace('.jpeg','.webp').replace('.png','.webp')}></img>
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
