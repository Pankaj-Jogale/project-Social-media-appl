import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Pankaj@3",
  database: "social",
});
//changes made in frontend
