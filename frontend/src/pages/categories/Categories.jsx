import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Categories() {
  const api = process.env.REACT_APP_API;
  const reactapp = process.env.REACT_APP;


  const [categories, setCategories] = useState();

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

  useEffect(() => {
    getAllcategories();
  }, []);

  return (
    <>
      <div className="page">
        <h2 className="heading">Explore Popular Categories</h2>
        <div className="homeCategoriesBlock">
          {categories &&
            categories.map((cat) => {
              return (
                <>
                  <div className="homeCategoriesSingle">
                    <Link to={"/category/" + cat.id}>
                      <img
                        className="categoryImage"
                        src={reactapp+"/images/" + cat.url}
                      ></img>
                      <h4 className="categoryTitle">{cat.name}</h4>
                    </Link>
                  </div>
                </>
              );
            })}
        </div>
      </div>
    </>
  );
}
