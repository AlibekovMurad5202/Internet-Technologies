const db = require("sync-mysql");   // импортируем модуль sync-mysql
const connection = new db({
    host:"localhost",
    user:"root",
    password:"root",
    database:"games"
});

module.exports = connection;