// index.js
const express = require('express')

const app = express()
const PORT = 4000


const nodemailer = require('nodemailer');
var bcrypt = require('bcryptjs');

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



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Set the file name
  },
});

var upload = multer({ storage: storage });



var recipt;

app.post("/insert", upload.single("image"), function (req, res) {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var password = req.body.password;
  var cpassword = req.body.cpassword;
  var phoneno = req.body.phoneno;
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;
  var domain = req.body.domain;
  var companyname = req.body.companyname;
  var image = req.file.filename;
  const phash = bcrypt.hashSync(password, salt);
  if (bcrypt.compareSync(cpassword, phash)) {
    var sql = `insert into users(firstname, lastname, email, password, phone, latitude, longitude, domain,companyname,image) values('${firstname}', '${lastname}', '${email}', '${phash}', '${phoneno}', '${latitude}', '${longitude}', '${domain}','${companyname}','${image}')`;

    conn.query(sql, function (err, results) {
      if (err) throw err;
      var data = {
        res: 1
      };
      res.send(JSON.stringify(data));
    });
  }
  else {
    var data = {
      res: -1
    };
    res.send(JSON.stringify(data));
  }
});


app.post("/insertproject", upload.single("image"), function (req, res) {
  var resu;
  var fid;
  var pname = req.body.pname;
  var pd = req.body.pd;
  var pdate = req.body.pdate;
  var pm = req.body.pm;
  var ps = req.body.ps;
  var loc = req.body.loc;
  var budget = req.body.budget;
  var mater = req.body.mater;
  var phasename = req.body.phasename;
  var phasedes = req.body.phasedes;
  var phasebudget = req.body.phasebudget;
  var phasedate = req.body.phasedate;
  var image = req.file.filename;
  var totalphases = req.body.totalphases;
  var noofplot = req.body.noofplot;
  phasename = phasename.split(",");
  phasebudget = phasebudget.split(",");
  phasedes = phasedes.split(",");
  phasedate = phasedate.split(",");
  console.log(phasename);
  console.log(phasedes);
  var sql = `insert into projects(pname, pdescription, pduration, pmanager, status, location, budget, material,image,totalphases,plots) values('${pname}', '${pd}', '${pdate}', '${pm}', '${ps}', '${loc}', '${budget}', '${mater}', '${image}','${totalphases}','${noofplot}')`;
  conn.query(sql, function (err, results) {
    if (err) throw err;
  });

  var sql2 = `select id from projects ORDER BY id DESC LIMIT 1`;
  conn.query(sql2, function (err, results) {
    if (err) throw err;
    console.log(results);
    if (results.length > 0) {
      var id = results[0].id;
      fid = id;
    }
  });
  
  for (var i = 0; i < phasename.length; i++) {
    var sql = `insert into phases(name, description, budget,duration, projectid,status) values('${phasename[i]}', '${phasedes[i]}', '${phasebudget[i]}', '${phasedate[i]}', (select id from projects ORDER BY id DESC LIMIT 1),'not active')`;
    console.log(sql);
    conn.query(sql, function (err, results) {
      if (err) throw err;
      resu = results;
    });
  }
  res.send(resu);
});


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

app.post("/updateproject", upload.single("image"), function (req, res) {
  var result;
  var id = req.body.id;
  var pname = req.body.pname;
  var pdescription = req.body.pdescription;
  var pmanager = req.body.pmanager;
  var image = req.file.filename;
  var pstatus = req.body.pstatus;
  var budget = req.body.budget;
  var phasedata = req.body.phasedata;
  var phasesids = req.body.phasesids;
  var comphases = req.body.comphases;
  console.log(phasedata);
  console.log(phasesids);
  phasesids= phasesids.split(",");
  phasedata= phasedata.split(",");
  var query1 = `UPDATE projects SET pname = ?, pdescription = ?,  pmanager = ?, image = ? , status = ? , budget = ? , completephase = ? WHERE id = ?`;
  var data = [pname, pdescription, pmanager, image, pstatus, budget, comphases, id];
  conn.query(query1, data, function (err, results) {
    if (err)
      throw err;
  });
  console.log(phasesids.length);
  for (var i = 0; i < phasesids.length; i++) {
    var sql = `Update phases set status = '${phasedata[i]}'  where id =  ${phasesids[i]}`;
    conn.query(sql, function (err, results) {
      if (err)
        throw err;
        result = results;
    });
  }
  res.send(result);
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