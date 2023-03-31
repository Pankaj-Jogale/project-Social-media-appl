import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const q = "SELECT * FROM admin WHERE adminname = ?";
  db.query(q, [req.body.adminname], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    //if not create const
    //hash the password(installed bcryptjs)

    const salt = bcrypt.genSaltSync(10); //making random string that makes hash unpredictable
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q = "INSERT INTO admin (`adminname`,`password`) VALUE (?)";
    const values = [req.body.adminname, hashedPassword];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created");
    });
  });
};

export const login = (req, res) => {
  console.log("called5");
  const q = "SELECT * FROM admin WHERE adminname = ?";
  db.query(q, [req.body.adminname], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found");
    console.log("called6");
    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password //user at 0 as array has match record which is 1
    );
    if (!checkPassword)
      return res.status(400).json("wrong password or username");

    const token = jwt.sign({ id: data[0].id }, "secretkey");
    const { password, ...others } = data[0]; //neglcting password from all info
    res
      .cookie("adminToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};
