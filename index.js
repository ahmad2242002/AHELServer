// index.js
const express = require('express')

const app = express()
const PORT = 4000


const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");

// Generate a salt for hashing
const salt = bcrypt.genSaltSync(10);
var mysql = require("mysql");
var multer = require("multer"); // Import Multer

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




var recipt;


app.post("/login", function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var sql = `Select * from users where email = '${email}'`;
  conn.query(sql, function (err, results) {
    if (err) throw err;
    if (results.length > 0) {
      results.forEach(function (obj) {
        if (bcrypt.compareSync(password, obj.password) && obj.domain == "user") {
          var data = {
            id: obj.ID
          };
          res.send(JSON.stringify(data));
        }
        else {
          var data = {
            id: -1
          };
          res.send(JSON.stringify(data));
        }
      });
    }
    else {
      var data = {
        id: -1
      };
      console.log(data);
      res.send(JSON.stringify(data));
    }
  });
});

app.get("/getproject", function (req, res) {
  var sql = `Select p.id,p.pname,p.status as pstatus,p.pdescription,ph.name,ph.status,p.totalphases,p.completephase from projects p join phases ph on p.id = ph.projectid`;
  conn.query(sql, function (err, results) {
    if (err) throw err;
    res.send(results);
  });
});

app.get("/getprojectuser", function (req, res) {
  var sql = `Select p.id,p.pname,p.status,p.pdescription,p.totalphases,p.completephase,p.plots,p.bookedplots from projects p`;
  conn.query(sql, function (err, results) {
    if (err) throw err;
    res.send(results);
  });
});


app.post("/getprojectupdate", function (req, res) {
  var id = req.body.id;
  var sql = `Select p.id,p.pname,p.status as pstatus,p.pdescription,p.budget,p.totalphases,p.completephase,p.pmanager,ph.name,ph.status,ph.id as phaseid from projects p join phases ph on p.id = ph.projectid && p.id = ${id}`;
  conn.query(sql, function (err, results) {
    if (err) throw err;
    res.send(results);
  });
});

app.post("/getindividualproject", function(req,res){
  console.log("hello");
  var id = req.body.id;
  var sql = `Select id,pname,pdescription,image,plots,bookedplots from projects where id = ${id}`;
  conn.query(sql, function (err, results) {
    if (err) throw err;
    res.send(results);
  });
});


app.get("/getallprojectorder", function(req,res){
  var sql = `Select id,pname,pdescription,image,plots,bookedplots from projects`;
  conn.query(sql, function (err, results) {
    if (err) throw err;
    res.send(results);
  });
});


app.post("/loginadmin", function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var sql = `Select * from users where email = '${email}'`;
  conn.query(sql, function (err, results) {
    if (err) throw err;
    if (results.length > 0) {
      results.forEach(function (obj) {
        if (bcrypt.compareSync(password, obj.password) && obj.domain == "company") {
          var data = {
            id: obj.ID
          };
          res.send(JSON.stringify(data));
        }
        else {
          var data = {
            id: -1
          };
          res.send(JSON.stringify(data));
        }
      });
    }
    else {
      var data = {
        id: -1
      };
      console.log(data);
      res.send(JSON.stringify(data));
    }
  });
});


app.post("/bookplot",function(req,res){
  var pid = req.body.id;
  var uid = req.body.userid;
  var sql = `Update projects set plots = plots - 1 , bookedplots = bookedplots + 1 where id = '${pid}'`;
  var sql2 = `insert into Porder (uid,pid,status) values ('${uid}','${pid}','inprogress')`;
  conn.query(sql,function (err, results) {
    if(err)
      throw err;
  });
  conn.query(sql2,function (err, results) {
    if(err)
      throw err;
      res.send(results);
  });
});

app.post("/getdata", function (req, res) {
  var id = req.body.id;
  var sql = `Select * from users where id = '${id}'`;
  conn.query(sql, function (err, results) {
    res.send(results);
  });
});
var otpCode;
app.post("/sendotp", function (req, res) {
  recipt = req.body.email;
  sendOTP();
  var data = { otpCode: otpCode };
  res.send(data);
});

// Create a transporter object with your email service provider credentials
function sendOTP() {
  console.log(recipt);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'az106725@gmail.com',
      pass: 'xmsocssezltewatm'
    }

  });
  // Generate a random OTP code
  otpCode = Math.floor(1000 + Math.random() * 9000);

  // Define the email content
  const mailOptions = {
    from: 'az106725@gmail.com',
    to: `${recipt}`,
    subject: 'OTP Code',
    text: `Your OTP code is: ${otpCode}`
  };

  // Send the email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})



// Export the Express API
module.exports = app