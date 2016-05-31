var app   = require('express')();
var http = require('http').Server(app);
var mysql = require('mysql');
var bodyParser = require("body-parser");
var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : '',
		database : 'ohrm',
	});
	
	app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

	
app.get('/',function(req,res){
	var data = {
		"Data":""
	};
	data["Data"] = "Welcome to GET & POST request Demo..";
	res.json(data);
});

app.get('/fetchdata',function(req,res){
	var data = {
		"Data":""
	};
	
	connection.query("SELECT * from hs_hr_employee",function(err, rows, fields){
		if(rows.length != 0){
			//data["Data"] = rows;
			res.json(rows);
		}else{
			data["Data"] = 'No data Found..';
			res.json(data);
		}
	});
});

app.post('/login',function(req,res){
	var email = req.body.email;
	var pass = req.body.password;
	var data = {
		"Data":""
	};
	connection.query("SELECT * from hs_hr_employee WHERE email=? and password=? LIMIT 1",[email,pass],function(err, rows, fields){
		if(rows.length != 0){
			data["Data"] = "Successfully logged in..";
			res.json(data);
		}else{
			data["Data"] = "Email or password is incorrect.";
			res.json(data);
		}
	});
});

http.listen(8082,function(){
	console.log("Connected & Listen to port 8082");
});