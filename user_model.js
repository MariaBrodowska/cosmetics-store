const { readFileSync } = require("fs");
let loadUsers = () => JSON.parse(readFileSync("users.json"));

module.exports = { loadUsers };
