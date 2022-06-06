import "./login.css";
import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../userContext";
import swal from "sweetalert";

export default function Login() {
  const api = process.env.REACT_APP_API;

  const [state, setState] = useState("login");
  const [login_username, setLogin_username] = useState("");
  const [login_password, setLogin_password] = useState("");
  const [register_username, setRegister_username] = useState("");
  const [register_password, setRegister_password] = useState("");
  const [register_phone, setRegister_phone] = useState("");
  const [register_email, setRegister_email] = useState("");
  const [status, setStatus] = useState("admin");

  const [error, setError] = useState("");
  const [user, setUser] = useState("");

  const { usertop, setUsertop } = useContext(UserContext);

  const loginSubmit = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      data: {
        login_username,
        login_password,
      },
      withCredentials: true,
      url: `${api + "/login"}`,
    })
      .then((res) => {
        setUser(res.data.user);
        setError("");
        console.log(res.data);
        setUsertop(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        //
      })
      .catch((error) => {
        if (error.response) {
          // console.log(error.response.data.message.message);
          setError(error.response.data.message.message);
          // console.log(error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      });
  };

  const logout = () => {
    axios({
      method: "POST",
      withCredentials: true,
      url: `${api + "/logout"}`,
    })
      .then((res) => {
        if (res.status == 200) {
          setUser("");
          //   setUsertop(null);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const registerSubmit = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      data: {
        register_username,
        register_password,
        status,
        register_phone,
        register_email,
      },
      withCredentials: true,
      url: `${api + "/register"}`,
    })
      .then((res) => {
        if (res.data == "user already exists") {
          setError("User already exists");
        }
        if (res.data == "please fill all fields") {
          setError("Please fill all fields");
        }
        if (res.data.message == "user registered successfully") {
          setError("");
          swal({
            title: "User Successfully Registered",
            text: "Now user can login to their account",
            icon: "success",
            button: "Ok",
          });
          var lastid = res.data.row.insertId;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (state == "login")
    return (
      <>
        <div className="loginForm">
          <form
            onSubmit={(e) => {
              loginSubmit(e);
            }}
          >
            <div className="form-outline mb-4">
              <h2>Login</h2>
            </div>
            <div className="form-outline mb-4">
              <input
                required
                type="text"
                id="form2Example1"
                className="form-control"
                placeholder="Username"
                onChange={(e) => {
                  setLogin_username(e.target.value);
                }}
              />
            </div>
            <div className="form-outline mb-4">
              <input
                required
                type="password"
                id="form2Example2"
                className="form-control"
                placeholder="Password"
                onChange={(e) => {
                  setLogin_password(e.target.value);
                }}
              />
            </div>
            <div className="row mb-4">
              <div className="col">
                {" "}
                <button
                  type="submit"
                  className="btn btn-primary btn-block mb-4"
                  style={{ width: 100 + "%" }}
                >
                  Sign in
                </button>
              </div>
              <p style={{ color: "red" }}>{error}</p>
            </div>
            {/* <div className="row mb-4">
              <div className="col">
                <a href="#!">Forgot password?</a>
              </div>
            </div> */}
            <div className="text-center">
              <p>
                Not a member?{" "}
                <a
                  href="#"
                  onClick={() => {
                    setState("register");
                  }}
                >
                  Register
                </a>
              </p>
            </div>
          </form>

          {user ? (
            <div id="welcome">
              {/* <p>welcome {user.username}</p> */}
              <button
                onClick={() => {
                  logout();
                }}
              >
                logout
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </>
    );
  if (state == "register")
    return (
      <>
        {" "}
        <div className="loginForm">
          <form
            onSubmit={(e) => {
              registerSubmit(e);
            }}
          >
            <div className="form-outline mb-4">
              <h2>Register</h2>
            </div>
            <div className="form-outline mb-4">
              <input
                required
                type="text"
                id="registerInput"
                className="form-control"
                placeholder="Username"
                onChange={(e) => {
                  setRegister_username(e.target.value);
                }}
              />
            </div>
            <div className="form-outline mb-4">
              <input
                required
                type="number"
                id="form2Example1"
                className="form-control"
                placeholder="Phone"
                onChange={(e) => {
                  setRegister_phone(e.target.value);
                }}
              />
            </div>
            <div className="form-outline mb-4">
              <input
                required
                type="Email"
                id="form2Example1"
                className="form-control"
                placeholder="Email"
                onChange={(e) => {
                  setRegister_email(e.target.value);
                }}
              />
            </div>

            <div className="form-outline mb-4">
              <input
                required
                type="password"
                id="form2Example2"
                className="form-control"
                placeholder="Password"
                onChange={(e) => {
                  setRegister_password(e.target.value);
                }}
              />
            </div>

            <div className="row mb-4">
              <div className="col">
                {" "}
                <button
                  type="submit"
                  className="btn btn-primary btn-block mb-4"
                  style={{ width: 100 + "%" }}
                >
                  Submit
                </button>
              </div>
              <p style={{ color: "red" }}>{error}</p>
            </div>
            <div className="text-center">
              <p>
                Already a user?{" "}
                <p
                  href="#"
                  onClick={() => {
                    setState("login");
                  }}
                >
                  Login
                </p>
              </p>
            </div>
          </form>
        </div>
      </>
    );
}
