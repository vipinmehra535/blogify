const express = require("express");
const path = require("path");

const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const port = 3000;

const connectDB = require("./config/db");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const Blog = require("./models/blog");

const { checkForAuthenticationCookie } = require("./middleware/authentication");

connectDB();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 });
  res.render("home", {
    user: req.user,
    blogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
