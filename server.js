const { loadProducts } = require("./product_model");
const { loadUsers } = require("./user_model");
const express = require("express");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
const arrayOfUsers = loadUsers();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/index.html"));
});

app.get("/register-page", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/register-page.html"));
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
    console.log("Odebrano dane:", req.body);
    let czyDodany = await isAdded(req.body);
    console.log(czyDodany);
    if (!czyDodany) {
      arrayOfUsers.push(req.body);
    }
    res.status(201).json(czyDodany);
    console.log("uzytkownicy na serwerze: ");
    console.log(arrayOfUsers);
  } catch (error) {
    res.status(500).send();
  }
});

function isAdded(data) {
  console.log("serwer: " + JSON.stringify(data));
  return arrayOfUsers.some((user) => user.email === data.email);
}

app.post("/api/logowanie", async (req, res) => {
  try {
    console.log("Odebrano dane:", req.body);
    let czyDodany = await czyZalogowano(req.body);
    console.log(czyDodany);
    res.status(201).json(czyDodany);
    console.log("uzytkownicy na serwerze: ");
    console.log(arrayOfUsers);
  } catch (error) {
    res.status(500).send();
  }
});
function czyZalogowano(data) {
  console.log("serwer: " + JSON.stringify(data));
  return arrayOfUsers.some(
    (user) => user.email === data.email && user.haslo === data.haslo
  );
}

const port = 3000;
app.listen(port, () => {
  console.log("Serwer running at port ${port}");
});
