import "./new_product.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

export default function New_product() {
  const api = process.env.REACT_APP_API;


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

  const submitHandler = async (e) => {
    e.preventDefault();
    const namex = name.current.value;
    const pricex = price.current.value;
    const descriptionx = description.current.value;
    const typex = type.current.value;
    const categoryx = category.current.value;
    const auctionx = auction_date.current.value;
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
          navigate("/account");
        } else if (res.data.message == "auction product added successfully") {
          swal({
            title: "Auction Product added successfully",
            text: "You can see all your auction products on account page",
            icon: "success",
            button: "Ok",
          });
          navigate("/account");
        } else {
          console.log(res);
          console.log("something went wrong");
        }

        //
      })
      .catch((error) => {
        console.log(error);
      });
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
            <input type="text" ref={name}></input>
          </div>
          <div className="formItem">
            <label>Price</label>
            <input type="number" ref={price}></input>
          </div>
          <div className="formItem">
            <label>Description</label>
            <textarea ref={description}></textarea>
          </div>
          <div className="formItem">
            <label>Selling type</label>
            {/* <input type="text" ref={type}></input> */}
            <select
              className="select"
              ref={type}
              onChange={(e) => {
                typeChanged(e);
              }}
            >
              <option value="direct">Direct</option>
              <option value="auction">Auction</option>
            </select>
          </div>
          <div className="formItem" id="lastDateBlock">
            <label>Auction last date</label>
            <input type="date" ref={auction_date}></input>
          </div>
          <div className="formItem">
            <label>Product image</label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.jfif,.webp"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            ></input>
          </div>
          <div className="formItem">
            <label>Category</label>
            <select name="category" className="select" ref={category}>
              <option value="1">Phones</option>
              <option value="2">Watches</option>
              <option value="3">Cars</option>
              <option value="4">Tablets</option>
              <option value="5">Houses</option>
              <option value="6">Others</option>
              <option value="7">Guns</option>
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
