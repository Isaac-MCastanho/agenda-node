const express = require("express");
const app = express();
const mongoose = require("mongoose");
const middlewareGlobal = require("./src/middlewares/middlewareGlobal");
require("dotenv").config();

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongoose conectado!");
    app.emit("pronto");
  });

const session = require("express-session");

const MongoStore = require("connect-mongo");

const flash = require("connect-flash");

const routes = require("./routes");
const path = require("path");
const helmet = require("helmet");
const csrf = require("csurf");

app.use(helmet());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, "public")));

const sessionOptions = session({
  secret: "ola123@vox",
  store: MongoStore.create({ mongoUrl: process.env.CONNECTION }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});

app.use(sessionOptions);
app.use(flash());

app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");

app.use(csrf());
app.use(middlewareGlobal.checkCsrfError);
app.use(middlewareGlobal.csrfMiddleware);
app.use(routes);

app.on("pronto", () => {
  app.listen(3000, () => {
    console.log("Servidor execuntando na porta 3000");
  });
});
