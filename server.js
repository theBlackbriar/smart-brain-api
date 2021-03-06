const express = require("express");
const app = express();
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcrypt-nodejs");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(`It is working!`);
}); // displays the database array

// this is the sign in route. it checks to see if the email and password match what is in our 'database'. and will login approriately.
app.post("/signin", (req, res) => {
  signin.handleSignIn(req, res, db, bcrypt);
});

// adds a new user with the passed in params to the database array via push()
// this does not statically save, if our server restarts, we lose this data
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

// gets the profile of the matching id that we add to the url bar via :id
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

// whenever someone enters an image, update the user's entries count
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});
app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(process.env.PORT, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
