import { useState, useEffect, useContext } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import "./home.css";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [allproducts, setAllproducts] = useState([]);
  const [categories, setCategories] = useState();
  const api = process.env.REACT_APP_API;

  const getAllcategories = () => {
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

  const allProducts = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: `${api + "/allproducts"}`,
    })
      .then((res) => {
        console.log('this is the response');
        console.log(allproducts)
        console.log({allProducts})
        setAllproducts(res.data.row);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAllcategories();
    allProducts();
  }, []);
  return (
    <>
      <div>
        <Carousel>
          <div>
            <img src={require("../../images/iphone.jpg")} />
          </div>
          <div>
            <img src={require("../../images/iphone2.jpg")} />
          </div>
        </Carousel>
      </div>
      <div className="page">
        <h2 className="heading">Explore Popular Categories</h2>
        <div className="homeCategoriesBlock">
          {categories &&
            categories.slice(0, 6).map((cat) => {
              return (
                <>
                  <div className="homeCategoriesSingle" key={cat.id}>
                    <Link to={"/category/" + cat.id}>
                      <img
                        className="categoryImage"
                        src={"http://localhost:4000/images/" + cat.url}
                      ></img>
                      <h4 className="categoryTitle">{cat.name}</h4>
                    </Link>
                  </div>
                </>
              );
            })}
        </div>
        <div>
          <h4 className="seeAll">
            <Link to="/categories">see all &gt; </Link>
          </h4>
        </div>

        <h2 className="heading">Recently Uploaded Products</h2>
        <div className="homeProductsBlock">
          {allproducts && allproducts
            .slice(-5)
            .reverse()
            .map((product) => {
              return (
                <div className="homeProductsSingle" key={product.id}>
                  <Link to={"/product/" + product.id}>
                    {" "}
                    <img
                      className="productImage"
                      src={"http://localhost:4000/images/" + product.url}
                    ></img>
                    <h4 className="productTitle">{product.name}</h4>
                  </Link>
                </div>
              );
            })}
        </div>

        <h2 className="heading">All Products</h2>
        <div className="homeProductsBlock">
          {allproducts && allproducts.slice(0, 10).map((product) => {
            return (
              <div className="homeProductsSingle" key={product.id}>
                <Link to={"/product/" + product.id}>
                  {" "}
                  <img
                    className="productImage"
                    src={"http://localhost:4000/images/" + product.url}
                  ></img>
                  <h4 className="productTitle">{product.name}</h4>
                </Link>
              </div>
            );
          })}
        </div>
        <div>
          <h4 className="seeAll">
            <Link to="/products">see all &gt; </Link>
          </h4>
        </div>
      </div>
    </>
  );
}
