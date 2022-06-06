const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const db = mysql.createPool(
  {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
  { multipleStatements: true }
);

function initialize(passport) {
  const authenticateUser = (req, login_username, login_password, cb) => {
    const sqlcheck = "SELECT * FROM users WHERE username = ?";
    values = [req.body.login_username];
    db.query(sqlcheck, req.body.login_username, (err, user) => {
      if (err) {
        console.log(err);
        return cb(err);
      }
      if (user.length == 0) {
        return cb(null, false, { message: "no user found" });
      } else {
        try {
          // console.log(user[0].password);
          // console.log(req.body.login_password);
          bcrypt.compare(
            req.body.login_password,
            user[0].password,
            function (err, res) {
              // console.log("err: " + err);
              // console.log("user: " + res);
              if (err) {
                throw err;
              }
              if (res) {
                const { password, ...others } = user[0];
                console.log(others);
                return cb(null, others);
              } else {
                return cb(null, false, { message: "incorrect password" });
              }
            }
          );
        } catch (e) {
          return cb(e);
        }
      }
    });
  };

  passport.use(
    new localStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "login_username",
        passwordField: "login_password",
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },
      authenticateUser
    )
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    const sqlcheck = "SELECT * FROM users WHERE id = ? ";
    db.query(sqlcheck, id, (err, user) => {
      cb(err, user);
    });
  });
}

module.exports = initialize;
