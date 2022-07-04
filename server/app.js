const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();
const routes = require("./routes");
const db = require("./db");

db();
const whitelist = ["http://localhost:3000", "https://billam.netlify.app"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(
  session({
    secret: "SECRET KEY",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/billam",
    }),
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", routes);
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server up on port ${PORT}`));
