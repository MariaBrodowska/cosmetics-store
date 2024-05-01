const { readFileSync } = require("fs");
let loadProducts = () => JSON.parse(readFileSync("products.json"));

module.exports = { loadProducts };
