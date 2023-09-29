// For backend and express
const { MongoClient } = require("mongodb");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
//console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {
  resp.send("App is Working");
  // You can check backend is working or not by
  // entering http://loacalhost:5000

  // If you see App is working means
  // backend working properly
});

// Replace the following with your Atlas connection string
const url = `${process.env.MONGO_URI}`;

// Connect to your Atlas cluster
const client = new MongoClient(url);
async function run() {
  try {
    await client.connect();
    console.log("Successfully connected to Atlas");
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

// To connect with your mongoDB database
const mongoose = require("mongoose");
mongoose
  .connect(`${process.env.MONGO_URI}`, {
    dbName: "myDB_Profile",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to myDB_Profile"))
  .catch((error) => {
    console.log(error);
  });

// Schema for users of app
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    //unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("users", UserSchema);
User.createIndexes();

// Register input to MongoDB database
app.post("/register", async (req, resp) => {
  try {
    const user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    if (result) {
      delete result.password;
      resp.send(req.body);
      console.log(result);
    } else {
      console.log("User already register");
    }
  } catch (e) {
    console.log(e);
    resp.send("Something Went Wrong");
  }
});
app.listen(5000);
