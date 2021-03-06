import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import expressSession from "express-session";

const app = express();

//Database
mongoose.connect("");

app.set("view engine", "ejs");

// middleware
import validationMiddleware from "./middleware/validationMiddlware.js";
import redirectIfAuthenticatedMiddleware from "./middleware/redirectIfAuthenticatedMiddleware.js";
import authMiddleware from "./middleware/authMiddleware.js";

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(
  expressSession({
    secret: "balroc is cool",
    resave: true,
    saveUninitialized: true,
  })
);

global.loggedIn = null;

app.use("*", (req, res, next) => {
  loggedIn = req.session.userId;
  next();
});

// Cron Job to update currency database
import updateCurrencyDatabase from "./controllers/updateCurrencyDatabase.js";
updateCurrencyDatabase();

// routing
import homeController from "./controllers/home.js";
import aboutController from "./controllers/about.js";
import newPostController from "./controllers/newPost.js";
import postController from "./controllers/post.js";
import registerController from "./controllers/register.js";
import loginController from "./controllers/login.js";
import logoutController from "./controllers/logout.js";
import forexController from "./controllers/forex.js";
import forexCurrencyController from "./controllers/forexCurrency.js";

app.get("/", homeController);
app.get('/about', aboutController)
app.get("/posts/new", authMiddleware, newPostController);
app.get("/posts/:id", postController);
app.get("/auth/register", authMiddleware, registerController); // Only registered Users are allowed to register others
app.get("/auth/login", redirectIfAuthenticatedMiddleware, loginController);
app.get("/auth/logout", logoutController);
app.get("/forex", forexController);
app.get("/forex/:currency", forexCurrencyController);

import storeUserController from "./controllers/storeUser.js";
import storePostController from "./controllers/storePost.js";
import loginUserController from "./controllers/loginUser.js";

app.post("/posts/store", validationMiddleware, authMiddleware, storePostController);
app.post("/users/register", redirectIfAuthenticatedMiddleware, storeUserController);
app.post("/users/login", redirectIfAuthenticatedMiddleware, loginUserController);

// 404
app.use((req, res) => res.render("404"));

// 500
app.use((err, req, res, next) => {
  res.status(500);
  res.render("500");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));
