const { readFileSync } = require("fs");
let loadOrders = () => JSON.parse(readFileSync("zamowienia.json"));

module.exports = { loadOrders };
