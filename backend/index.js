import express, { json } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import cookieParser from "cookie-parser";
import pool from "./db.js";
import { nanoid } from "nanoid";
import multer from "multer";

const app = express();
const Port = 8001;

const uploadfile = multer({ dest: "profilepicture/" });

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app
  .route("/signup")

  .post((req, res) => {
    const username = req.body.username?.toLowerCase(); // Implementation of transformation here
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    //Validations
    if (!username) {
      return res.status(422).json({
        success: false,
        error: "EMPTY_USERNAME",
        message: "Username Shouldnt be empty",
      });
    }

    if (
      typeof username === "boolean" ||
      typeof username === "object" ||
      typeof username === "symbol"
    ) {
      return res
        .status(400)
        .json("Username should be a text not a object or a boolean");
    }

    if (username.length > 50 || username.length < 3) {
      return res.status(422).json({
        success: false,
        error: "USERNAME_TOOLONG_TOOSHORT",
        message: "Username should be less than 50 characters and more than 3",
      });
    }

    if (username.includes(" ")) {
      return res.status(422).json({
        success: false,
        error: "USERNAME_SPACES",
        message: "Username should'nt consists spaces",
      });
    }

    if (!password || password.length < 8 || password.includes(" ")) {
      return res.status(422).json({
        success: false,
        error: "PASSWORD_TOOSHORT_TOOLONG",
        message: "Password must be of 8 characters and shouldnt consist spaces",
      });
    }

    if (!confirmpassword) {
      return res.status(400).json({
        success: false,
        error: "CONFIRM_PASSWORD_REQUIRED",
        message: "You must confirm your password",
      });
    }

    if (confirmpassword !== password) {
      return res.status(400).json({
        success: false,
        error: "PASSWORD_CONFIRMATION_INVALID",
        message: "Confirmation password didnt matched",
      });
    }

    bcrypt
      .hash(password, 13)

      .then((hashedpass) => {
        pool
          .query("INSERT INTO users (username,password) VALUES ($1,$2)", [
            username,
            hashedpass,
          ])

          .then((result) => {
            return res.status(201).json({
              success: true,
              message: "Sucessfully SignedIn",
            });
          })

          .catch((err) => {
            console.log(err.message);
            const random = nanoid(6);

            if (err.code === "23505") {
              return res.status(403).json({
                error: "USERNAME_ALREDY_EXISTS",
                success: false,
                message: `Try this instead ${username}${random}`,
              });
            }

            return res.status(500).json({
              success: false,
              message: "Server Error",
            });
          });
      })

      .catch((err) => {
        console.log(err.message);

        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      });
  }); // endpoint brackets

app
  .route("/login")

  .post((req, res) => {
    async function DbQuery() {
      try {
        const result = await pool.query(
          "SELECT * FROM users WHERE username = $1",
          [req.body.username?.toLowerCase()],
        );

        if (result.rowCount === 0) {
          return res.status(404).json({
            success: false,
            error: "USERNAME_NOT_FOUND",
            message: "Username dosen't exists",
          });
        }

        const username = result.rows[0].username;
        const userid = result.rows[0].userid;
        const hashedpassword = result.rows[0].password;

        const matched = await bcrypt.compare(req.body.password, hashedpassword);

        if (!matched) {
          return res.status(401).json({
            error: "PASSWORD_USERNAME_NOTMATCHED",
            message: "Username or password didnt matched",
            success: false,
          });
        }

        if (matched) {
          const token = jwt.sign(
            { username: username, userid: userid },
            process.env.JWTSEC,
            { expiresIn: "2h" },
          );

          res.cookie("jwt", token, { sameSite: "lax", httpOnly: true });

          return res.json({
            message: "Sucessfully Logged In",
            success: true,
          });
        }
      } catch (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    }

    DbQuery();
  });

const jwtvalidation = (req, res, next) => {
  const token = req.cookies.jwt;

  // console.log(`Cookies` , req.cookies);

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "SESSION_EXPIRED",
      message: "Session Expired Try to relogin",
    });
  }

  jwt.verify(token, process.env.JWTSEC, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Couldnt verify token try to relogin",
      });
    }

    if (decoded) {
      req.user = decoded;
      next();
    }
  });
};

app
  .route("/authcheck")

  .get(jwtvalidation, (req, res) => {
    return res.status(200).json({
      success: true,
      message: "User Authenticated",
    });
  });

// this route is reponsible for asking user What's should we call you ?

app
  .route("/name")

  .post(jwtvalidation, (req, res) => {
    const name = req.body.name?.toLowerCase();
    const userid = req.user.userid;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "NAME_REQUIRED",
        message: "Please Enter your Name so that we can call your by your Name",
      });
    }

    if (name.length < 1 || name.length > 30) {
      return res.status(400).json({
        success: false,
        error: "NAME_TOOLONG_TOOSHORT",
        message:
          "Name shouldn't consist of more than 30 character and less than 1",
      });
    }

    if (/\d/.test(name)) {
      return res.status(400).json({
        success: false,
        error: "NUMBERS_NOT_ALLOWED_IN_NAME",
        message: "Name shouldn't consist of any numbers",
      });
    }

    async function DbQuery() {
      try {
        await pool.query("UPDATE users SET name = ($1) WHERE  userid = ($2)", [
          name,
          userid,
        ]);

        return res.status(201).json({
          success: true,
          message: `Welcome to Calibar ${name}`,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    }

    DbQuery();
  });

// Displays UserNAME And Name

app
  .route("/viewprofile")

  .get(jwtvalidation, (req, res) => {
    async function DbQuery() {
      const userid = req.user.userid;

      try {
        const result = await pool.query(
          "SELECT name , username FROM users WHERE userid = ($1)",
          [userid],
        );

        res.json({
          success: true,
          message: result.rows[0],
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          error: "SERVER_ERROR",
          message: "Server Error",
        });
        console.log(err.message);
      }
    }

    DbQuery();
  });

app
  .route("/workouts")

  .post(jwtvalidation, (req, res) => {
    const workoutname = req.body.workoutname?.toLowerCase();
    const totalreps = req.body.totalreps;
    const totalsets = req.body.totalsets;
    const userid = req.user.userid;

    console.log(userid);

    async function DbQuery() {
      try {
        if (!workoutname || workoutname.length > 30 || workoutname.length < 4) {
          return res.status(422).json({
            error: "WORKOUTNAME_TOOLONG_TOOSHORT",
            message:
              "Workoutname Should atleast be 4 characters long and Shouldn't be More than 30 characters",
            success: false,
          });
        }

        if (/\d/.test(workoutname)) {
          return res.status(400).json({
            success: false,
            error: "NUMBERS_INCLUDES",
            message: "Workout Name should'nt consists of Numbers",
          });
        }

        if (totalreps < 1 || totalsets < 1) {
          return res.status(422).json({
            error: "TOTALREPS_TOOLOW",
            message: "TotalReps And Totalsets Should atleast be more than 0",
            success: false,
          });
        }

        const result = await pool.query(
          "INSERT INTO workouts (userid , workoutname , totalreps , totalsets) VALUES ($1,$2,$3,$4)",
          [userid, workoutname, totalreps, totalsets],
        );

        return res.status(201).json({
          success: true,
          message: "Workout Tracked Sucessfully",
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          message: "Server Error",
        });
        console.log(err.message);
      }
    }

    DbQuery();
  })

  .get(jwtvalidation, (req, res) => {
    const userid = req.user.userid;

    async function DbQuery() {
      try {
        const result = await pool.query(
          "SELECT  workoutid , workoutname , totalreps , totalsets , workoutdate FROM workouts WHERE userid = ($1)",
          [userid],
        );

        if (result.rowCount === 0) {
          return res.json({
            success: false,
            error: "WORKOUT_NOTFOUND",
            message: "No workouts Found linking to your profile",
          });
        }

        return res.json({
          success: true,
          message: result.rows,
        });
      } catch (err) {
        console.log(err.message);

        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    }

    DbQuery();
  });

app
  .route("/deleteworkouts/:workoutid")

  .delete(jwtvalidation, (req, res) => {
    const userid = req.user.userid;
    const workoutid = req.params.workoutid;

    async function DbQuery() {
      try {
        await pool.query(
          "DELETE FROM workouts WHERE userid = $1 AND workoutid = $2",
          [userid, workoutid],
        );
        return res.status(200).json({
          success: true,
          message: "Workout Deleted Sucessfully",
        });
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    }

    DbQuery();
  });

// -------------------- Filteration  Via Workout Name  ---------------------,
// In frontend we will add a search input and serach button

app
  .route("/workouts/:workoutname")

  .get(jwtvalidation, (req, res) => {
    async function DbQuery(params) {
      try {
        const userid = req.user.userid;

        const result = await pool.query(
          "SELECT workoutid, workoutname , totalreps , totalsets , workoutdate FROM workouts WHERE userid = ($1) AND workoutname ILIKE ($2)",
          [userid, `${req.params.workoutname}%`],
        );

        if (result.rowCount === 0) {
          return res.status(404).json({
            success: false,
            message: "No workouts found",
          });
        }

        return res.json({
          success: true,
          message: result.rows,
        });
      } catch (err) {
        console.log(err.message);
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    }

    DbQuery();
  });

app
  .route("/logout")

  .delete((req, res) => {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "lax" });
    return res.status(200).send("Sucessfully Loggedout");
  });

app
  .route("/deleteaccount")

  .delete(jwtvalidation, (req, res) => {
    const reqid = req.user.userid;

    async function DbQuery() {
      try {
        await pool.query("DELETE FROM workouts WHERE userid = $1", [reqid]);

        await pool.query("DELETE FROM users WHERE userid = $1", [reqid]);

        res.clearCookie("jwt", { httpOnly: true, sameSite: "lax" });
        res.send("Account Sucessfully Deleted");
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    }

    DbQuery();
  });

app
  .route("/activefor")

  .get(jwtvalidation, (req, res) => {
    const reqid = req.user.userid;

    async function DbQuery() {
      try {
        const result = await pool.query(
          "SELECT DISTINCT workoutdate FROM workouts WHERE userid = $1 ",
          [reqid],
        );

        if (result.rowCount === 0) {
          return res.status(200).json({
            success: true,
            message: "0 day",
          });
        }

        const activedays = result.rows.length;

        return res.status(200).json({
          success: true,
          message: `${activedays} day`,
        });
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    }
    DbQuery();
  });

app
  .route("/workoutcounts")

  .get(jwtvalidation, (req, res) => {
    async function DbQuery() {
      const userid = req.user.userid;

      try {
        const result = await pool.query(
          "SELECT COUNT (workoutname) FROM workouts WHERE userid = $1",
          [userid],
        );

        const totalcount = result.rows[0].count;

        return res.json({
          success: true,
          message: totalcount,
        });
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    }

    DbQuery();
  });

app
  .route("/uploadprofile")

  .post(jwtvalidation, uploadfile.single("pp"), (req, res) => {
    const profilepicture = req.file.filename;
    const userid = req.user.userid;

    async function DbQuery() {
      try {
        await pool.query(
          "UPDATE users SET profilepicture = $1 WHERE userid = $2",
          [profilepicture, userid],
        );
        return res.status(200).json({
          success: true,
          message: profilepicture,
        });
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    }

    DbQuery();
  });

app.listen(Port, () => {
  console.log(`Server Started At ${Port}`);
});
