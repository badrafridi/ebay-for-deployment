const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const initializePassport = require("./mypassport");
const multer = require("multer");
const path = require("path");
initializePassport(passport);
const schedule = require("node-schedule");
const dotenv = require("dotenv");
const { cloudinary } = require("./utils/cloudinary");

dotenv.config();

const db = mysql.createPool(
  {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
  { multipleStatements: true }
);

db.on("error", function (err) {
  console.log("[mysql error]", err);
});

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin: "https://ebay-testing.herokuapp.com",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(
  session({
    secret: "secretCode",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 4 * 60 * 60 * 1000 },
  })
);

app.use(cookieParser("secretCode"));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "/frontend/build")));

app.listen(process.env.PORT || 4000, () => {
  console.log(process.env.PORT);
  console.log("server has started");
});

app.use("/images", express.static(path.join(__dirname, "public/images")));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.name);
//   },
// });

// const upload = multer({ storage });
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   try {
//     return res.status(200).json("file uploaded successfully");
//   } catch {
//     console.log(err);
//   }
// });

// upload images
app.post("/api/upload", async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "dev_setups",
    });
    res.send(uploadedResponse.url);
  } catch (error) {
    console.log(error);
  }
});

// cron job function to end auction timings
const cronFunc = (date, product_id) => {
  console.log("cron func called because of adding new product");
  console.log(
    "cron function running to check if the time of auction has ended..."
  );
  const someDate = new Date(date);
  console.log(
    "cron function is checking if we have touched this date > " + someDate
  );
  const job = schedule.scheduleJob(someDate, function () {
    const sqlcheck = `UPDATE products SET status = 'sold' WHERE id = ${product_id}`;
    db.query(sqlcheck, product_id, (err, row) => {
      if (err) {
        console.log(err);
      }
      if (row) {
        console.log(row);
        // console.log("user registered successfully");
      }
    });
  });
};

// register user (admin,teacher,student)
app.post("/api/register", async (req, res) => {
  try {
    const username = req.body.register_username;
    const hashedPassword = await bcrypt.hash(req.body.register_password, 10);
    const status = req.body.status;
    const phone = req.body.register_phone;
    const email = req.body.register_email;

    //if any value empty return
    if (phone == "" || email == "" || username == "") {
      res.send("please fill all fields");
    }
    // if all values recieved fine then continue
    else {
      // console.log("working till else");
      const sqlquery = "SELECT * FROM users WHERE username = ?";
      db.query(sqlquery, username, (err, row) => {
        if (err) throw err;
        // if there is already a user with this username. return
        if (row[0]) {
          console.log("user already exist");
          res.send("user already exists");
        }
        //   if there is no user on that username already, create new
        else {
          // console.log("working till double else");
          const sqlcheck =
            "INSERT INTO users (username,password,status,email,phone) VALUES (?,?,?,?,?)";
          values = [username, hashedPassword, status, email, phone];
          db.query(sqlcheck, values, (err, row) => {
            if (err) {
              // console.log(err);
              res.send(err);
            }
            if (row) {
              // console.log("user registered successfully");
              res.send({ message: "user registered successfully", row });
            }
          });
        }
      });
    }
  } catch {}
});

app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    // console.log(user);
    if (err) throw err;
    if (!user) {
      res.status(401).json({ message: info });
    } else {
      req.login(user, (err) => {
        if (err) throw err;
        if (user) {
          if (user.status == 1) {
            console.log("yes this is admin");
          }
          res.status(200).json({ message: "successful authentication", user });
        }
      });
    }
  })(req, res, next);
});
app.post("/api/logout", (req, res) => {
  req.logout();
  res.status(200).json({ message: "succssfully logout" });
});

// get user data to show on page
app.get("/api/user", (req, res) => {
  // console.log(req.user);
  if (req.user) {
    res.send({ user: req.user, message: "user logged in" });
  } else {
    res.send({ user: null, message: "no user" });
  }
  //   console.log(req.user);
});

//test
app.get("/api/users", (req, res) => {
  // console.log(req.user);

  // console.log(req.user);
  if (req.user) {
    const sqlcheck = "SELECT * from users";
    db.query(sqlcheck, (err, row) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      if (row) {
        // console.log("user registered successfully");
        res.send({ message: "here are all the users", row });
      }
    });
  } else {
    res.send({
      user: null,
      message: "you are not authenticated to see all users",
    });
  }
  //   console.log(req.user);
});

// get user with user id
app.post("/api/getuserwithuserid", (req, res) => {
  if (req.user) {
    const id = req.body.idx;
    console.log("getting user id");
    console.log(id);
    const sqlcheck = "SELECT * FROM users WHERE id = ?";
    db.query(sqlcheck, id, (err, row) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      if (row) {
        // console.log("user registered successfully");
        res.send({ message: "here is the user", row });
      }
    });
  } else {
    res.send({ message: "you are not authenticated" });
  }
});

// add new product by user
app.post("/api/addnewproduct", (req, res) => {
  if (req.user) {
    // console.log(req.body);
    const name = req.body.namex;
    const price = req.body.pricex;
    const description = req.body.descriptionx;
    const type = req.body.typex;
    const category = req.body.categoryx;
    const url = req.body.urlx;
    const user_id = req.user[0].id;
    const date_end = req.body.auctionx;
    const last_bid = 0;
    var last_bidder_id = req.user[0].id;
    var status = "not sold";
    var auction_status = "pending";

    if (type == "direct") {
      const sqlcheck =
        "INSERT INTO products (name,price,description,type,category_id,url,user_id,status) VALUES (?,?,?,?,?,?,?,?)";
      values = [name, price, description, type, category, url, user_id, status];
      db.query(sqlcheck, values, (err, row) => {
        if (err) {
          console.log(err);
          res.send(err);
        }
        if (row) {
          res.send({ message: "Direct product added successfully", row });
        } else {
          res.send("you are not authenticated to add new product");
        }
      });
    }
    if (type == "auction") {
      const sqlcheck =
        "INSERT INTO products (name,price,description,type,category_id,url,user_id,status) VALUES (?,?,?,?,?,?,?,?)";
      values = [name, price, description, type, category, url, user_id, status];
      db.query(sqlcheck, values, (err, row) => {
        if (err) {
          console.log(err);
          res.send(err);
        }
        if (row) {
          var product_id = row.insertId;

          const queryx =
            "INSERT INTO auctions (product_id,end_date,last_bid,last_bidder_id,user_id,status) VALUES (?,?,?,?,?,?)";
          values = [
            product_id,
            date_end,
            last_bid,
            last_bidder_id,
            user_id,
            auction_status,
          ];
          db.query(queryx, values, (err, row) => {
            if (err) {
              console.log("inner error");
              console.log(err);
              res.send(err);
            }
            if (row) {
              cronFunc(date_end, product_id);
              res.send({ message: "auction product added successfully", row });
            }
          });
        } else {
          res.send("you are not authenticated to add new product");
        }
      });
    }
  }
});

// get all products of single user
app.get("/api/allproductsofuser", (req, res) => {
  if (req.user) {
    const user_id = req.user[0].id;
    const sqlcheck =
      "SELECT products.*  FROM users, products, category WHERE users.id 	= '?' AND products.user_id = '?' AND category.id = products.category_id";
    db.query(sqlcheck, [user_id, user_id], (err, row) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      if (row) {
        // console.log("user registered successfully");
        res.send({ message: "here are all the users", row });
      }
    });
  } else {
    res.send({
      user: null,
      message: "you are not authenticated to see all users",
    });
  }
  //   console.log(req.user);
});

// get all products on database
app.get("/api/allproducts", (req, res) => {
  const sqlcheck = "SELECT * from products";
  db.query(sqlcheck, (err, row) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    if (row) {
      // console.log("user registered successfully");
      res.send({ message: "here are all the products", row });
    }
  });

  //   console.log(req.user);
});

// get single product
app.get("/api/allsingleproduct/:id", (req, res) => {
  const id = req.params["id"];

  const sqlcheck =
    "SELECT p.*, c.name as category_name FROM products p, category c WHERE p.id = ? AND p.category_id = c.id ";
  db.query(sqlcheck, id, (err, row) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    if (row) {
      res.send({ message: "here is your product", row });
    }
  });

  //   console.log(req.user);
});

// get single product auction details with product id for account page auction orders
app.get("/api/allsingleauctiondetails/:id", (req, res) => {
  const id = req.params["id"];

  const sqlcheck =
    "SELECT auctions.* , users.username, products.* FROM auctions, users, products WHERE auctions.product_id = ? AND products.id = ? AND auctions.last_bidder_id = users.id";
  db.query(sqlcheck, [id, id], (err, row) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    if (row) {
      if (row.length == 0) {
        res.send({
          message: "can't get auction details because this is direct product",
          row,
        });
      } else {
        res.send({ message: "here are the auction details", row });
      }
    }
  });

  //   console.log(req.user);
});

// get single product auction details with auction id for single auction page
app.get("/api/allsingleauctiondetailstwo/:id", (req, res) => {
  const id = req.params["id"];
  console.log("auction product");
  console.log(id);

  const sqlcheck =
    "SELECT a.rated_by_seller, a.rated_by_buyer, a.status as auction_status, a.end_date, a.last_bid, a.last_bidder_id, a.user_id, a.address , u.username as seller, p.name as product_name, p.price as original_price, p.description as product_description, p.type as product_type, p.url as img_url, p.status FROM auctions a, users u, products p WHERE a.id = ? AND a.product_id = p.id AND a.user_id = u.id;";
  db.query(sqlcheck, [id], (err, row) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    if (row) {
      if (row.length == 0) {
        res.send({
          message: "something went wrong, can't get auction details.",
          row,
        });
      } else {
        res.send({ message: "here are the auction details", row });
      }
    }
  });

  //   console.log(req.user);
});

// get multiple products through ids for cart
app.post("/api/getproductsforcart", (req, res) => {
  const ids = req.body.cart;

  var sqlcheck = "SELECT * FROM products WHERE id =";
  for (var i = 0; i < ids.length; i++) {
    if (i == ids.length - 1) {
      sqlcheck = sqlcheck + ` ${ids[i]}`;
    } else {
      sqlcheck = sqlcheck + ` ${ids[i]} OR id =`;
    }
  }
  db.query(sqlcheck, (err, row) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    if (row) {
      // console.log("user registered successfully");
      res.send({ message: "here are list of products from cart", row });
    }
  });
});

// place order
app.post("/api/placeorder", (req, res) => {
  if (req.user) {
    const user_id = req.user[0].id;
    const ids = req.body.productids;
    const buyer_name = req.body.namex;
    const buyer_phone = req.body.phonex;
    const buyer_address = req.body.addressx;
    const status = "pending";

    console.log("here is the phone number: " + buyer_phone);

    // getting today's time
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
    var values = [];
    for (var i = 0; i < ids.length; i++) {
      values.push([
        user_id,
        ids[i],
        buyer_name,
        buyer_phone,
        buyer_address,
        status,
        dateTime,
      ]);
    }

    var sqlcheck = `INSERT INTO orders (user_id,product_id,buyer_name,buyer_phone,buyer_address,status,date) VALUES ? `;

    db.query(sqlcheck, [values], (err, row) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      if (row) {
        // values and query to change product status from not sold to sold
        // var valuesTwo = [];
        // for (var i = 0; i < ids.length; i++) {
        //   valuesTwo.push([ids[i]]);
        // }
        // var sqlchecktwo = `UPDATE products SET status = 'sold' WHERE id = '?' `;
        var sqlchecktwo = "";
        if (ids.length == 1) {
          sqlchecktwo = `UPDATE products SET status = 'sold' WHERE id = ${ids[0]}`;
        } else {
          for (var i = 0; i < ids.length; i++) {
            if (i == 0) {
              sqlchecktwo =
                sqlchecktwo +
                `UPDATE products SET status = 'sold' WHERE id = ${ids[i]} OR `;
            }
            if (i == ids.length - 1) {
              sqlchecktwo = sqlchecktwo + `id = ${ids[i]}`;
            } else {
              sqlchecktwo = sqlchecktwo + `id = ${ids[i]} OR `;
            }
          }
        }

        db.query(sqlchecktwo, (err, row) => {
          if (err) {
            console.log(err);
            res.send(err);
          }
          if (row) {
            console.log(row);
            res.send({
              message:
                "order placed successfully, and product status updated to sold",
              row,
            });
          }
        });
      }
    });
  } else {
    res.send("you are not authenticated to place an order");
  }
});

// get all buying orders by a user
app.get("/api/userorders", (req, res) => {
  if (req.user) {
    var id = req.user[0].id;
    const sqlcheck =
      "SELECT orders.id, orders.status , orders.date , products.name ,products.price , products.url FROM orders, products WHERE orders.product_id = products.id AND orders.user_id = ?";
    db.query(sqlcheck, id, (err, row) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      if (row) {
        // console.log("user registered successfully");

        res.send({ message: "here are the user orders", row });
      }
    });
  } else {
    res.send("you are not authenticated to see orders data");
  }
});

// delete a product
app.delete("/api/deleteproduct", (req, res) => {
  if (req.user) {
    var user_id = req.user[0].id;
    const sqlcheck = "DELETE FROM products WHERE user_id = ? AND id = ?";
    db.query(sqlcheck, [user_id, req.body.id], (err, row) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      if (row) {
        // console.log("user registered successfully");
        res.send({ message: "product successfully deleted", row });
      }
    });
  } else {
    res.send("sorry you are not authenticated");
  }
});

// get all categories
app.get("/api/getallcategories", (req, res) => {
  const sqlcheck = "SELECT * FROM category";
  db.query(sqlcheck, (err, row) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    if (row) {
      // console.log("user registered successfully");

      res.send({ message: "here are all the categories", row });
    }
  });
});

// get products for single category
app.get("/api/getproductsofsinglecategory/:id", (req, res) => {
  const id = req.params["id"];
  const sqlcheck = "SELECT * FROM products WHERE category_id = ?";
  db.query(sqlcheck, id, (err, row) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    if (row) {
      // console.log("user registered successfully");

      res.send({ message: "here are all the ", row });
    }
  });
});

// get selling orders of a user  (done)
app.get("/api/usersellingorders", (req, res) => {
  if (req.user) {
    var id = req.user[0].id;
    const sqlcheck =
      "SELECT products.name, products.price, products.type, products.url, orders.id, orders.buyer_name, orders.status, orders.date FROM products, orders WHERE products.user_id = ? AND products.id = orders.product_id";
    db.query(sqlcheck, id, (err, row) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      if (row) {
        // console.log("user registered successfully");

        res.send({ message: "here are selling orders of user", row });
      }
    });
  } else {
    res.send("you are not authenticated to see orders data");
  }
});

// get user auction selling orders
app.get("/api/userauctionsellingorders", (req, res) => {
  if (req.user) {
    var id = req.user[0].id;
    const sqlcheck =
      "SELECT products.name as product_name, products.status, products.price, products.type, products.url, auctions.id as auction_id, auctions.end_date, auctions.last_bid, users.username as seller FROM products, auctions, users WHERE products.user_id = ? AND products.id = auctions.product_id AND auctions.user_id = ? AND users.id = ?";
    db.query(sqlcheck, [id, id, id], (err, row) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      if (row) {
        // console.log("user registered successfully");

        res.send({ message: "here are selling auction orders of user", row });
      }
    });
  } else {
    res.send("you are not authenticated to see orders data");
  }
});

// get user auction buying orders
app.get("/api/userauctionbuyingorders", (req, res) => {
  if (req.user) {
    var id = req.user[0].id;
    const sqlcheck =
      "SELECT products.name as product_name, products.url, products.price, products.status as product_status, auctions.end_date, auctions.status as auction_status, auctions.id as auction_id, auctions.last_bid FROM products, auctions, users WHERE products.id = auctions.product_id AND auctions.last_bidder_id = ? AND users.id = ?;";
    db.query(sqlcheck, [id, id], (err, row) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      if (row) {
        // console.log("user registered successfully");

        res.send({ message: "here are selling auction orders of user", row });
      }
    });
  } else {
    res.send("you are not authenticated to see orders data");
  }
});

// set direct order as delivered from seller
app.post("/api/markasdelivered", (req, res) => {
  const id = req.body.order_id;
  const sqlcheck = " UPDATE orders SET status = 'delivered' WHERE id = '?' ";
  db.query(sqlcheck, id, (err, row) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    if (row) {
      // console.log("user registered successfully");
      res.send({ message: "successfully delivered ", row });
    }
  });
});

// set auction order as delivered from seller
app.post("/api/markauctionasdelivered", (req, res) => {
  if (req.user) {
    const auction_id = req.body.id;
    const user_id = req.user[0].id;

    const sqlcheck =
      " UPDATE auctions SET status = 'delivered' WHERE id = ? AND user_id = '?' ";
    db.query(sqlcheck, [auction_id, user_id], (err, row) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      if (row) {
        if (row.length == 0) {
          res.send({ message: "auction order not found", row });
        }
        // console.log("user registered successfully");
        res.send({ message: "auction order successfully delivered", row });
      }
    });
  } else {
    res.send({ message: "please login to mark the orders as delivered" });
  }
});

// set auction order as completed by buyer
app.post("/api/markauctionascompleted", (req, res) => {
  if (req.user) {
    const auction_id = req.body.id;
    const user_id = req.user[0].id;

    const sqlcheck =
      " UPDATE auctions SET status = 'completed' WHERE id = ? AND last_bidder_id = '?' ";
    db.query(sqlcheck, [auction_id, user_id], (err, row) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      if (row) {
        if (row.length == 0) {
          res.send({ message: "auction order not found", row });
        }
        // console.log("user registered successfully");
        res.send({ message: "auction order successfully completed", row });
      }
    });
  } else {
    res.send({ message: "please login to mark the orders as delivered" });
  }
});

// get single buying order
app.get("/api/getproductsforcart/:id", (req, res) => {
  const id = req.params["id"];
  const sqlcheck =
    "SELECT orders.user_id as buyer_id, orders.buyer_name, orders.buyer_phone, orders.buyer_address, orders.status, orders.date, orders.rated_by_seller, orders.rated_by_buyer , products.name as product_name, products.price as product_price, products.user_id as seller_id, users.username as seller_name FROM orders, products, users WHERE orders.id = ? AND orders.product_id = products.id AND users.id = products.user_id";
  db.query(sqlcheck, id, (err, row) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    if (row) {
      // console.log("user registered successfully");
      res.send({ message: "here is the order ", row });
    }
  });
});

// set order as completed from buyer
app.post("/api/markascompleted", (req, res) => {
  const id = req.body.order_id;
  const sqlcheck = " UPDATE orders SET status = 'completed' WHERE id = '?' ";
  db.query(sqlcheck, id, (err, row) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    if (row) {
      // console.log("user registered successfully");
      res.send({ message: "order successfully completed ", row });
    }
  });
});

// place bid on a product
app.put("/api/placebid", (req, res) => {
  const bid = req.body.bidx;
  const product_id = req.body.product_id;
  const user_id = req.user[0].id;
  const user_name = req.user[0].name;
  const address = req.body.addressx;

  const sqlcheck =
    "UPDATE auctions SET last_bid = ? , last_bidder_id = '?', address = ?  WHERE product_id = '?' ";
  db.query(sqlcheck, [bid, user_id, address, product_id], (err, row) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    if (row) {
      res.send({ message: "new bid successfully added", row });
    }
  });
});

// check if a user can buy a product
app.get("/api/checkproduct/:id", (req, res) => {
  const id = req.params["id"];
  const sqlcheck = "SELECT orders.* from orders WHERE orders.product_id = ?";
  db.query(sqlcheck, id, (err, row) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    if (row) {
      // console.log("user registered successfully");
      res.send({ message: "here is the order of this product", row });
    }
  });
});

// rate buyer or seller for auction
app.post("/api/rateauserforauction", (req, res) => {
  console.log("auction rating func running on backend");
  if (req.user) {
    var ratingby = req.user[0].id;
    const sellerid = req.body.sellerid;
    const buyerid = req.body.buyerid;
    const auctionid = req.body.id;
    const totalRating = req.body.totalRating;

    console.log("logged in user id");
    console.log(ratingby);
    console.log("product upload by user id");
    console.log(sellerid);
    console.log("total rating: ");
    console.log(totalRating);

    // means user is seller and wants to rate buyer
    if (ratingby == sellerid) {
      const sqlcheck =
        "SELECT * FROM auctions WHERE auctions.id = ? AND auctions.user_id = ? AND auctions.last_bidder_id = ?";
      db.query(sqlcheck, [auctionid, ratingby, buyerid], (err, row) => {
        if (err) {
          console.log(err);
          res.send(err);
        }
        if (row) {
          console.log("got auction successfully");
          console.log(row[0].last_bidder_id);
          if (row.length > 0) {
            const sqlcheck =
              "UPDATE users SET rating = rating + ? , no_of_ratings = no_of_ratings + 1 WHERE id = ?";
            db.query(sqlcheck, [totalRating, buyerid], (err, row) => {
              if (err) {
                console.log(err);
                res.send(err);
              }
              if (row) {
                const sqlchecktwo =
                  "UPDATE auctions SET rated_by_seller = 'true' WHERE id = ?";
                db.query(sqlchecktwo, auctionid, (err, row) => {
                  if (err) {
                    console.log(err);
                    res.send(err);
                  }
                  if (row) {
                    console.log(row);
                    res.send({
                      message: "rating the buyer and everything done",
                      row,
                    });
                  }
                });
              }
            });
          }
        }
      });
    }

    // means user is buyer and wants to rate seller
    if (ratingby == buyerid) {
      const sqlcheck =
        "SELECT * FROM auctions WHERE auctions.id = ? AND auctions.user_id = ? AND auctions.last_bidder_id = ?";
      db.query(sqlcheck, [auctionid, sellerid, buyerid], (err, row) => {
        if (err) {
          console.log(err);
          res.send(err);
        }
        if (row) {
          console.log("got auction successfully");
          console.log(row[0].last_bidder_id);
          if (row.length > 0) {
            const sqlcheck =
              "UPDATE users SET rating = rating + ? , no_of_ratings = no_of_ratings + 1 WHERE id = ?";
            db.query(sqlcheck, [totalRating, sellerid], (err, row) => {
              if (err) {
                console.log(err);
                res.send(err);
              }
              if (row) {
                const sqlchecktwo =
                  "UPDATE auctions SET rated_by_buyer = 'true' WHERE id = ?";
                db.query(sqlchecktwo, auctionid, (err, row) => {
                  if (err) {
                    console.log(err);
                    res.send(err);
                  }
                  if (row) {
                    console.log(row);
                    res.send({
                      message: "rating the seller and everything done",
                      row,
                    });
                  }
                });
              }
            });
          }
        }
      });
    }
  } else {
    res.send({ message: "you are not authenticated" });
  }
});

// rate buyer or seller for direct orders
app.post("/api/rateauserfororder", (req, res) => {
  if (req.user) {
    var ratingby = req.user[0].id;
    const sellerid = req.body.sellerid;
    const buyerid = req.body.buyerid;
    const orderid = req.body.id;
    const totalRating = req.body.totalRating;

    console.log("logged in user id");
    console.log(ratingby);
    console.log("product upload by user id");
    console.log(sellerid);
    console.log("total rating: ");
    console.log(totalRating);

    // means user is seller and wants to rate buyer
    if (ratingby == sellerid) {
      const sqlcheck =
        "SELECT * FROM orders WHERE orders.id = ? AND orders.user_id = ? ";
      db.query(sqlcheck, [orderid, buyerid], (err, row) => {
        if (err) {
          console.log(err);
          res.send(err);
        }
        if (row) {
          console.log(row);
          console.log("got direct order successfully");
          console.log(row[0].user_id);
          console.log(row[0]);
          console.log(row.length);
          if (row.length > 0) {
            console.log("working till now");
            const sqlcheck =
              "UPDATE users SET rating = rating + ? , no_of_ratings = no_of_ratings + 1 WHERE id = ?";
            db.query(sqlcheck, [totalRating, buyerid], (err, row) => {
              if (err) {
                console.log(err);
                res.send(err);
              }
              if (row) {
                console.log("working till now double");
                const sqlchecktwo =
                  "UPDATE orders SET rated_by_seller = 'true' WHERE id = ?";
                db.query(sqlchecktwo, orderid, (err, row) => {
                  if (err) {
                    console.log(err);
                    res.send(err);
                  }
                  if (row) {
                    console.log("working till now triple");
                    console.log(row);
                    res.send({
                      message: "rating the buyer and everything done",
                      row,
                    });
                  }
                });
              }
            });
          } else {
            res.send({ message: "sorry couldn't update the users rating" });
          }
        }
      });
    }

    // means user is buyer and wants to rate seller
    if (ratingby == buyerid) {
      const sqlcheck =
        "SELECT * FROM orders WHERE orders.id = ? AND orders.user_id = ?";
      db.query(sqlcheck, [orderid, buyerid], (err, row) => {
        if (err) {
          console.log(err);
          res.send(err);
        }
        if (row) {
          console.log("i am buyer");
          console.log("got direct order successfully");
          console.log(row[0].user_id);
          if (row.length > 0) {
            console.log("buyer working till now");
            const sqlcheck =
              "UPDATE users SET rating = rating + ? , no_of_ratings = no_of_ratings + 1 WHERE id = ?";
            db.query(sqlcheck, [totalRating, sellerid], (err, row) => {
              if (err) {
                console.log(err);
                res.send(err);
              }
              if (row) {
                console.log("buyer working till now double");
                console.log(row);
                if (row.affectedRows > 0) {
                  console.log("buyer working till now triple");

                  const sqlchecktwo =
                    "UPDATE orders SET rated_by_buyer = 'true' WHERE id = ?";
                  db.query(sqlchecktwo, orderid, (err, row) => {
                    if (err) {
                      console.log(err);
                      res.send(err);
                    }
                    if (row) {
                      console.log(row);
                      res.send({
                        message: "rating the seller and everything done",
                        row,
                      });
                    }
                  });
                }
              } else {
                res.send({ message: "couldn't get the order" });
              }
            });
          } else {
            res.send({ message: "sorry couldn't update the users rating" });
          }
        }
      });
    }
  } else {
    res.send({ message: "you are not authenticated" });
  }
});

// get user rating by user id
app.post("/api/getuserrating", (req, res) => {
  var user_id = req.body.user_id;
  const sqlcheck =
    "SELECT users.username, users.rating , users.no_of_ratings FROM users WHERE id = ? ";
  db.query(sqlcheck, [user_id], (err, row) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    if (row) {
      res.send({ message: "here is the user ratings", row });
    }
  });
});

// ------------------------admin routes started-----------------------------

// get all orders for admin
app.get("/api/allorders", (req, res) => {
  if (req.user) {
    const sqlcheck =
      "SELECT o.id, o.buyer_name, o.buyer_phone, o.status as order_status, o.date, p.name, p.price, p.type, u.username as seller_name, u.phone as seller_phone FROM orders o, products p, users u WHERE o.product_id = p.id AND p.user_id = u.id";
    db.query(sqlcheck, (err, row) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      if (row) {
        res.send({ message: "here are all the orders", row });
      }
    });
  }
});

// get all auction orders for admin
app.get("/api/allauctions", (req, res) => {
  if (req.user) {
    const sqlcheck =
      "SELECT a.id, a.end_date, a.last_bid, a.status, a.address, ub.username as last_bidder_name, ub.phone as last_bidder_phone, us.username as seller_name, us.phone as seller_phone, p.name as product_name, p.price FROM auctions a, products p, users ub, users us WHERE a.product_id = p.id AND ub.id = a.last_bidder_id AND us.id = a.user_id;";
    db.query(sqlcheck, (err, row) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      if (row) {
        res.send({ message: "here are all the auction", row });
      }
    });
  }
});

// get all products for admin
app.get("/api/allproductsforadmin", (req, res) => {
  if (req.user) {
    const sqlcheck =
      "SELECT products.*, category.name as category_name, users.username as seller_name, users.phone as seller_phone from products, category, users WHERE products.category_id = category.id AND products.user_id = users.id;";
    db.query(sqlcheck, (err, row) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      if (row) {
        res.send({ message: "here are all the products", row });
      }
    });
  }
});

// add new category
app.post("/api/addnewcategory", (req, res) => {
  var name = req.body.namex;
  var url = req.body.urlx;
  const sqlcheck = "INSERT INTO category (name,url) VALUES (?,?)";
  db.query(sqlcheck, [name, url], (err, row) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    if (row) {
      res.send({ message: "category successfully added", row });
    }
  });
});

//for front end
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/build", "index.html"));
});
