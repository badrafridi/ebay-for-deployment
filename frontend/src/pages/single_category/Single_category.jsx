import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function Single_category() {
  const api = process.env.REACT_APP_API;
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const [products, setProducts] = useState([]);

  const getProducts = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: `${api + "/getproductsofsinglecategory/" + path}`,
    })
      .then((res) => {
        console.log(res);
        setProducts(res.data.row);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getProducts();
  }, []);
  return (
    <>
      <div className="page">
        <div className="homeProductsBlock">
          {products.length > 0 ? (
            products.map((product) => {
              return (
                <>
                  <div className="homeProductsSingle">
                    <Link to={"/product/" + product.id}>
                      {" "}
                      <img className="productImage" src={product.url.replace('.jpg','.webp').replace('.jpeg','.webp').replace('.png','.webp')}></img>
                      <h4 className="productTitle">{product.name}</h4>
                    </Link>
                  </div>
                </>
              );
            })
          ) : (
            <>
              <p>No products found in this category, try other categories</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
