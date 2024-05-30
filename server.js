const { loadProducts } = require("./product_model");
const { loadUsers } = require("./user_model");
const { loadOrders } = require("./zamowienia_model");
const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { readFileSync, writeFileSync } = require("fs");
const fs = require("fs");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

let arrayOfUsers = loadUsers();
let arrayOfOrders = loadOrders();

function saveUsersToFile(users) {
  try {
    fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));
    console.log("Pomyślnie zapisano użytkowników do pliku.");
  } catch (error) {
    console.error("Błąd podczas zapisywania użytkowników do pliku:", error);
  }
}

function saveOrdersToFile(orders) {
  try {
    fs.writeFileSync("./zamowienia.json", JSON.stringify(orders, null, 2));
    console.log("Pomyślnie zapisano zamowienie do pliku.");
  } catch (error) {
    console.error("Błąd podczas zapisywania zamowienia do pliku:", error);
  }
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/index.html"));
});

app.get("/register-page", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/register-page.html"));
});

app.get("/user-page", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/user-page.html"));
});

app.get("/kontakt", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/kontakt.html"));
});

app.get("/koszyk", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/koszyk.html"));
});

app.get("/api/products", async (req, res) => {
  const response = await loadProducts();
  res.status(200).json(response);
});

app.post("/api/users", async (req, res) => {
  try {
    let czyDodany = await isAdded(req.body);
    if (!czyDodany) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.haslo, salt);
      req.body.haslo = hashedPassword;
      arrayOfUsers.push(req.body);
      await saveUsersToFile(arrayOfUsers);
    }
    res.status(201).json(czyDodany);
    console.log("uzytkownicy na serwerze: ");
    console.log(arrayOfUsers);
  } catch {
    res.status(500).send();
  }
});

function generujNumerZamowienia() {
  let nr;
  let unikalny = false;

  while (!unikalny) {
    nr = uuidv4();
    nr = nr.slice(0, 13);
    unikalny = !arrayOfOrders.some((order) => order.nr === nr);
  }
  return nr;
}

app.post("/api/zamowienia", async (req, res) => {
  try {
    let nr = generujNumerZamowienia();
    req.body.nr = nr;
    arrayOfOrders.push(req.body);
    await saveOrdersToFile(arrayOfOrders);
    console.log(nr);
  } catch {
    res.status(500).send();
  }
});

function isAdded(data) {
  console.log("serwer: " + JSON.stringify(data));
  return arrayOfUsers.some((user) => user.email === data.email);
}

app.post("/api/users/czyPoprawne", async (req, res) => {
  try {
    const user = await arrayOfUsers.find(
      (user) => user.email === req.body.email
    );
    if (!user) {
      res.status(500).send(false);
    }
    if (await bcrypt.compare(req.body.haslo, user.haslo))
      res.status(201).json(true);
    else res.status(201).json(false);
  } catch {
    res.status(500).send(false);
  }
});
app.post("/api/users/modyfikuj", async (req, res) => {
  try {
    console.log("przed:");
    console.log(arrayOfUsers);
    let user = await arrayOfUsers.find((user) => user.email === req.body.email);
    const index = await arrayOfUsers.findIndex(
      (user) => user.email === req.body.email
    );
    console.log(index);
    if (!user) {
      res.status(500).send(false);
    }
    console.log("znaleziono");
    if (!req.body.haslo) {
      const haslo = user.haslo;
      console.log(user.haslo);
      user = req.body;
      user.haslo = haslo;
      console.log(user);
      console.log("nie bylo nowego hasla");
    } else {
      console.log("2" + req.body.haslo);
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.haslo, salt);
      req.body.haslo = hashedPassword;
      user = req.body;
      console.log("bylo");
    }
    arrayOfUsers[index] = user;
    console.log("po:");
    console.log(arrayOfUsers);
    await saveUsersToFile(arrayOfUsers);
  } catch {
    res.status(500).send();
  }
});
app.get("/api/users/wyswietlZamowienie", authenticateToken, (req, res) => {
  console.log("Authorization header:", req.headers["authorization"]);
  const userOrders = arrayOfOrders.filter(
    (order) => order.email === req.user.email
  );
  res.json(userOrders);
});

app.post("/api/users/login", async (req, res) => {
  console.log("Odebrano dane:", req.body);
  const user = arrayOfUsers.find((user) => user.email === req.body.email);
  if (!user) {
    console.log("1 - nie znaleziono uzytkownika");
    res.status(201).send(false);
  }
  try {
    if (await bcrypt.compare(req.body.haslo, user.haslo)) {
      console.log("2 - poprawne haslo");
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken: accessToken });
      console.log(accessToken);
    } else {
      console.log("3 - bledne haslo");
      res.status(201).json(false);
    }
  } catch {
    console.log("4 - blad w tworzeniu tokena");
    res.status(500).send();
  }
  console.log("uzytkownicy na serwerze: ");
  console.log(arrayOfUsers);
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
    console.log("Decoded Token:", decodedToken);
    if (err) return res.sendStatus(403);
    req.user = decodedToken;
    next();
  });
}

app.get("/api/users/dane", authenticateToken, (req, res) => {
  console.log("Authorization header:", req.headers["authorization"]);
  console.log("User:", req.user);
  res.json(arrayOfUsers.filter((user) => user.email === req.user.email));
});

const port = 3000;
app.listen(port, () => {
  console.log("Serwer running at port ${port}");
});
