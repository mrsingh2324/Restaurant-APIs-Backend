const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(cors());

let credList = [];

readFromFile();

app.post("/signup", (req, res) => {
  const { fullName, email, password } = req.body;

  if (fullName == "" || email == "" || password == "") {
    res.json({ message: "Please enter valid details" });
    return;
  } else {
    for (let i = 0; i < credList.length; i++) {
      if (credList[i].email == email) {
        res.json({ message: "User already exists!" });
        return;
      }
    }
    credList.push({ fullName, email, password });
    let jsonData = JSON.stringify(credList);

    writeToFile(jsonData);
    res.json({ message: "User created successfully!" });
  }
});

app.post("/login", (req, res) => {
  const { loginMail, loginPassword } = req.body;
  let userFound = false;

  for (let i = 0; i < credList.length; i++) {
    if (
      credList[i].email == loginMail &&
      credList[i].password == loginPassword
    ) {
      userFound = true;
      res.json({ message: "Logged in successfully!" });
      break;
    }
  }

  if (!userFound) {
    res.json({ message: "Invalid email or password" });
  }
});

app.post("/resetPassword", (req, res) => {
  const { email, fullName, newPassword } = req.body;
  let userFound = false;

  for (let i = 0; i < credList.length; i++) {
    if (credList[i].email == email && credList[i].fullName == fullName) {
      userFound = true;
      credList[i].password = newPassword;
      const jsonData = JSON.stringify(credList);
      writeToFile(jsonData);
      res.json({ message: "Password changed successfully!" });
      break;
    }
  }

  if (!userFound) {
    res.json({ message: "Invalid email or full name" });
  }
});

function readFromFile() {
  fs.readFile("credentials.json", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      credList = JSON.parse(data.toString());
    }
  });
}

function writeToFile(jsonData) {
  fs.writeFile("credentials.json", jsonData, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Data inserted");
    }
  });
}

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
