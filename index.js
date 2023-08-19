// index.js
const express = require('express')

const app = express()
const PORT = 4000

// Generate a salt for hashing
var mysql = require("mysql");

var bodyParser = require("body-parser");
var cors = require("cors");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var conn = mysql.createConnection({
  host: "sql6.freesqldatabase.com",
  user: "sql6640919",
  password: "Enxh8WESKP",
  database: "sql6640919",
});

conn.connect(function (err) {
  if (err) throw err;
  console.log("Connection Sucessful");
});




app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})



// Export the Express API
module.exports = app