// index.js
const express = require('express')

const app = express()
const PORT = 4000


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());





app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})



// Export the Express API
module.exports = app