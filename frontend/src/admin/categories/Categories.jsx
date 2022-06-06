import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import swal from "sweetalert";

export default function Categories() {
  const api = process.env.REACT_APP_API;

  const [categories, setCategories] = useState();

  const name = useRef();
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    const namex = name.current.value;
    var urlx = "";

    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);

      urlx = fileName;

      try {
        await axios.post(`${api + "/upload"}`, data);
      } catch (err) {
        console.log(err);
      }
    }

    axios({
      method: "POST",
      data: {
        namex,
        urlx,
      },
      withCredentials: true,
      url: `${api + "/addnewcategory"}`,
    })
      .then((res) => {
        console.log(res);
        if (res.data.message == "category successfully added") {
          swal({
            title: "Category successfully added",
            text: "Now users can see the new category",
            icon: "success",
            button: "Ok",
          });
          getAllcategories();
          document.getElementById("file").value = null;
          document.getElementById("name").value = null;
        } else {
          console.log("something went wrong");
        }
      })

      .catch((error) => {
        console.log(error);
      });
  };

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
        <div className="createCategoryBlock">
          <h2 className="heading">Add New Category</h2>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <input
              type="text"
              ref={name}
              placeholder="Category Name"
              id="name"
            ></input>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.jfif,.webp"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
              id="file"
            ></input>
            <button type="submit">Submit</button>
          </form>
        </div>
        <h2 className="heading">All Categories</h2>
        <div className="homeCategoriesBlock">
          {categories &&
            categories.map((cat) => {
              return (
                <>
                  <div className="homeCategoriesSingle">
                    <Link to={"/category/" + cat.id}>
                      <img
                        className="categoryImage"
                        src={"/images/" + cat.url}
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
