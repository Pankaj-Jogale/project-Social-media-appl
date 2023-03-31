import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = (req, res) => {
  //check user exists
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    //if not create const
    //hash the password(installed bcryptjs)

    const salt = bcrypt.genSaltSync(10); //making random string that makes hash unpredictable
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q =
      "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)";
    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created");
    });
  });
};

export const login = (req, res) => {
  console.log("login");
  const q = "SELECT * FROM users WHERE USERNAME = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password //user at 0 as array has match record which is 1
    );
    if (!checkPassword)
      return res.status(400).json("wrong password or username");

    const token = jwt.sign({ id: data[0].id }, "secretkey");
    const { password, ...others } = data[0]; //neglcting password from all info
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  console.log("in logout");
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none", //api&react port diff so to avoid block in securing
    })
    .status(200)
    .json("User has been logged-out");
};

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Access token not found" });
  } else {
    return res.status(200).json({ message: "Access token  found" });
  }

  // try {
  //   const decoded = jwt.verify(token, "secretkey");
  //   req.userId = decoded.id;
  //   next();
  // } catch (err) {
  //   return res.status(401).json({ message: "Invalid access token" });
  // }
};
