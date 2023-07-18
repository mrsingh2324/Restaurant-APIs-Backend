const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();

app.use(express.json());
app.use(cors());

let db;
MongoClient.connect(
  "mongodb+srv://satyam1232:Satyam111@cluster0.utflrfz.mongodb.net/?retryWrites=true&w=majority"
)
  .then((client) => {
    db = client.db("food-delivery-database");
    console.log("connected to db server");
  })
  .catch((err) => {
    console.log(err);
  });

app.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (fullName == "" || email == "" || password == "") {
    res.json({ message: "Please enter valid details" });
    return;
  } else {
    const result2 = await db.collection("user-cred").find({ email });
    const result = result2.toArray();
    console.log(result);
    if (result.length) {
      res.json({ message: "email already present" });
      return;
    }
    const user = { fullName, email, password };
    await db.collection("user-cred").insertOne(user);
    console.log("user added to db !");
    res.json({ message: "User created successfully!" });
  }
});

app.post("/login", async (req, res) => {
  const { loginMail, loginPassword } = req.body;

  if (loginMail && loginPassword) {
    const result = await db
      .collection("user-cred")
      .findOne({ email: loginMail });
    if (result) {
      if (result.password == loginPassword) {
        res.json({ message: `logged in as ${result.fullName} !!` });
      } else {
        res.json({ message: "Invalid password !!" });
      }
      console.log(result.password);
      console.log(result.fullName);
    } else {
      res.json({ message: "User doesn't exist !!" });
    }
  } else {
    res.json({ message: "Please enter email and password both !!" });
  }
});

app.post("/resetPassword", async (req, res) => {
  const { email, fullName, newPassword } = req.body;
  if (email && fullName && newPassword) {
    const result = await db.collection("user-cred").find({ email }).toArray();
    if (result.length) {
      console.log(result.fullName);
      if (result[0].fullName == fullName) {
        await db
          .collection("user-cred")
          .updateOne({ email }, { $set: { password: newPassword } });
        // console.log(password, newPassword);
        res.json({ message: "password changed successfully :)) " });
        return;
      } else {
        res.json({ message: "Invalid fullName  :( " });
        return;
      }
    }
  }

  res.json({ message: "Password changed successfully!" });
});

app.post("/addResto", async (req, res) => {
  const restoDetails = req.body;
  if (restoDetails) {
    await db.collection("restaurant").insertOne(restoDetails);
    res.json({ message: "restaurant added" });
    return;
  } else {
    res.json({ message: "details missing" });
  }
});

app.get("/getResto", async (req, res) => {
  console.log("get resto called");
  const { location, foodType } = req.query;
  const result = await db.collection("restaurant").find({}).toArray();

  if (result.length) {
    console.log(result.length);

    let filteredRestaurants;

    if (location && foodType) {
      filteredRestaurants = result.filter((restaurant) => {
        const { address } = restaurant.details;
        const foodItems = restaurant.foodItems;

        return (
          address === location &&
          (foodItems.veg.some((item) => item.name === foodType) ||
            foodItems["non-veg"].some((item) => item.name === foodType))
        );
      });
    } else if (location) {
      filteredRestaurants = result.filter(
        (restaurant) => restaurant.details === location
      );
    } else if (foodType) {
      filteredRestaurants = result.filter((restaurant) => {
        const foodItems = restaurant.foodItems;
        return (
          foodItems.veg.some((item) => item.name === foodType) ||
          foodItems["non-veg"].some((item) => item.name === foodType)
        );
      });
    } else {
      filteredRestaurants = [];
    }

    if (filteredRestaurants.length) {
      res.json({
        message: "Restaurants found based on the filters:",
        result: filteredRestaurants,
      });
      console.log("Filtered Restaurants:", filteredRestaurants);
    } else {
      res.json({ message: "No restaurants found based on the filters!" });
    }
  } else {
    console.log("inside result.length check condition !");
    res.json({ message: "No result to show!" });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
