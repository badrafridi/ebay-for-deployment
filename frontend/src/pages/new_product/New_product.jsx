import "./new_product.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

export default function New_product() {
  const api = process.env.REACT_APP_API;
  const [previewSource, setPreviewSource] = useState("");
  const [fileInputState, setFileInputState] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [categories, setCategories] = useState([]);

  const name = useRef();
  const price = useRef();
  const description = useRef();
  const type = useRef();
  const category = useRef();
  const auction_date = useRef(null);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);

  // const history = useHistory();
  const navigate = useNavigate();

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    previewFile(file);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const namex = name.current.value;
    const pricex = price.current.value;
    const descriptionx = description.current.value;
    const typex = type.current.value;
    const categoryx = category.current.value;
    const auctionx = auction_date.current.value;
    var urlx = "";
    console.log("selected file");
    console.log(selectedFile);
    if (!previewSource) {
      axios({
        method: "POST",
        data: {
          namex,
          pricex,
          descriptionx,
          typex,
          auctionx,
          categoryx,
          urlx,
        },
        withCredentials: true,
        url: `${api + "/addnewproduct"}`,
      })
        .then((res) => {
          console.log(res);
          if (res.data.message == "Direct product added successfully") {
            swal({
              title: "Product added successfully",
              text: "You can see all your products on account page",
              icon: "success",
              button: "Ok",
            });
            // navigate("/account");
          } else if (res.data.message == "auction product added successfully") {
            swal({
              title: "Auction Product added successfully",
              text: "You can see all your auction products on account page",
              icon: "success",
              button: "Ok",
            });
            // navigate("/account");
          } else {
            console.log(res);
            console.log("something went wrong");
          }

          //
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios({
        method: "POST",
        data: JSON.stringify({ data: previewSource }),
        headers: { "Content-type": "application/json" },
        withCredentials: true,
        url: `${api + "/upload"}`,
      })
        .then((res) => {
          console.log("uploading...");
          urlx = res.data;
          axios({
            method: "POST",
            data: {
              namex,
              pricex,
              descriptionx,
              typex,
              auctionx,
              categoryx,
              urlx,
            },
            withCredentials: true,
            url: `${api + "/addnewproduct"}`,
          })
            .then((res) => {
              console.log(res);
              if (res.data.message == "Direct product added successfully") {
                swal({
                  title: "Product added successfully",
                  text: "You can see all your products on account page",
                  icon: "success",
                  button: "Ok",
                });
                // navigate("/account");
              } else if (
                res.data.message == "auction product added successfully"
              ) {
                swal({
                  title: "Auction Product added successfully",
                  text: "You can see all your auction products on account page",
                  icon: "success",
                  button: "Ok",
                });
                // navigate("/account");
              } else {
                console.log(res);
                console.log("something went wrong");
              }

              //
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const typeChanged = (e) => {
    if (e.target.value == "auction") {
      document.getElementById("lastDateBlock").style.visibility = "visible";
      document.getElementById("lastDateBlock").style.maxHeight = "100px";
      document.getElementById("lastDateBlock").style.marginBottom = "20px";
    } else {
      document.getElementById("lastDateBlock").style.visibility = "hidden";
      document.getElementById("lastDateBlock").style.maxHeight = "0px";
      document.getElementById("lastDateBlock").style.marginBottom = "0px";
    }
  };

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
    <>
      <div className="page">
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <div className="formItem">
            <label>Product name</label>
            <input type="text" ref={name} required></input>
          </div>
          <div className="formItem">
            <label>Price</label>
            <input type="number" ref={price}></input>
          </div>
          <div className="formItem">
            <label>Description</label>
            <textarea ref={description} required></textarea>
          </div>
          <div className="formItem">
            <label>Selling type</label>
            {/* <input type="text" ref={type}></input> */}
            <select
              className="select"
              required
              ref={type}
              onChange={(e) => {
                typeChanged(e);
              }}
            >
              <option value="">Selling Type</option>
              <option value="direct">Direct</option>
              <option value="auction">Auction</option>
            </select>
          </div>
          <div className="formItem" id="lastDateBlock">
            <label>Auction last date</label>
            <input type="date" ref={auction_date} required></input>
          </div>
          <div className="formItem">
            <label>Product image</label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.jfif,.webp"
              value={fileInputState}
              onChange={(e) => {
                handleFileInputChange(e);
              }}
            ></input>
          </div>
          <div className="formItem">
            <label>Category</label>
            <select name="category" className="select" ref={category} required>
              <option value="">Category</option>
              {categories &&
                categories.map((cat) => {
                  return (
                    <>
                      <option value={cat.id}>{cat.name}</option>
                    </>
                  );
                })}
            </select>
          </div>
          <div className="formItem">
            <input
              className="btn btn-primary btn-block mb-4"
              type="submit"
            ></input>
          </div>
        </form>
      </div>
    </>
  );
}
