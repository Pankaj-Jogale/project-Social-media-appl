import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import adminRoutes from "./routes/admin.js";
import postRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import { db } from "./connect.js";
import moment from "moment";

const app = express();
//middlewares(allow to send json obj)
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //cb(null, "../client/public/");
    cb(null, "../client/public/");
  },
  filename: function (req, file, cb) {
    //cb(null, Date.now() + file.originalname);
    const fileName = Date.now() + file.originalname;
    cb(null, "/upload/" + fileName);
  },
});

const upload = multer({ storage: storage });

app.use("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/admin", adminRoutes);

app.get("/messages", (req, res) => {
  console.log("called2");
  res.send("Hello, NodeJS people2!");
});

app.get("/frds", (req, res) => {
  const search = req.query.id;
  console.log(search);
  console.log("called3");
  let followerId = 4;
  const q = `select * from users`;
  const q1 = `SELECT users.id,users.username,users.name,users.profilePic FROM users JOIN relationships ON users.id = relationships.followedUserId
    WHERE relationships.followerUserId = ${search}`;
  db.query(q1, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
});

app.get("/stories", (req, res) => {
  const search = req.query.id;
  console.log(search);
  console.log("stories");
  const q = `SELECT s.img, s.userId FROM stories s INNER JOIN relationships r ON s.userId = r.followedUserId WHERE r.followerUserId = ${search}`;
  const q1 = `SELECT p.*, u.id AS userId, name, profilePic FROM stories AS p JOIN users AS u ON (u.id = p.userId)
    LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ${search} OR p.userId = ${search} ORDER BY id DESC `;
  db.query(q1, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
});

app.post("/api/stories", upload.single("storyImage"), async (req, res) => {
  console.log("upload");
  const userId = req.body.userId;
  //const imgUrl = `http://localhost:3000/${req.file.path}`;
  // const imgUrl = `/upload/${req.file.filename}`; //saves filname as /upload/name.img so during fetching no need to wrte /upload/ again
  const imgUrl = `${req.file.filename}`;
  try {
    const result = await db.query(
      "INSERT INTO stories (userId, img) VALUES (?, ?)",
      [userId, imgUrl]
    );
    console.log("Story uploaded successfully!");
    res.json({ message: "Story uploaded successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.get("/msg", (req, res) => {
  console.log("msg");
  const conversationId = req.query.conversationId;
  const conversationId2 = req.query.conversationId2;

  console.log(conversationId);
  console.log(conversationId2);

  console.log("called3 in msg");
  // const q = `select * from msg where conversationId=${search}`;

  const q1 = `SELECT * FROM msg WHERE conversationId IN (${conversationId},${conversationId2}) ORDER BY msgId DESC`;

  db.query(q1, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
});
app.post("/getmsg", (req, res) => {
  console.log("getting msg");
  const { senderId, recipientId, conversationId, message } = req.body;
  const q =
    "INSERT INTO msg (`senderId`,`recipientId`,`message`,`createdAt`,`conversationId`) VALUES (?)";
  const values = [
    req.body.senderId,
    req.body.recipientId,
    req.body.message,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), //installed library moment for date
    req.body.conversationId,
  ];
  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
});

app.get("/userslist", (req, res) => {
  console.log("calledlist");
  const q = `SELECT * FROM users`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
});

app.get("/users", (req, res) => {
  console.log("called4");
  // const search = req.query.name.toLowerCase().replace(/\s+/g, "");
  // console.log(search);
  // const q = `SELECT * FROM users WHERE LOWER(REPLACE(name, ' ', '')) LIKE '%${search}%'`;

  const search = req.query.name.toLowerCase().replace(/\s+/g, " ").trim();
  const keywords = search.split(" ");
  const keywordQueries = keywords.map(
    (keyword) => `LOWER(REPLACE(name, ' ', '')) LIKE '%${keyword}%'`
  );
  const q = `SELECT id,username, email, name, coverPic, profilePic, city, website FROM users WHERE ${keywordQueries.join(
    " AND "
  )}`;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
});
app.get("/user", (req, res) => {
  console.log("called5");

  const q =
    "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)";
  const values = [
    req.body.username,
    req.body.email,
    req.body.password,
    req.body.name,
    req.body.coverPic,
    req.body.profilePic,
    req.body.city,
    req.body.website,
  ];
  db.query(q, [req.body.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
  console.log(req.body.id);
});
app.listen(8800, () => {
  console.log("API WRKing on 8800 port");
});
