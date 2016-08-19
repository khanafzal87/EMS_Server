var app = require('express')();
var http = require('http').Server(app);
var mysql = require('mysql');
var path = require('path');
var multer  = require('multer');
var bodyParser = require("body-parser");
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ohrm',
});
/*var storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(path.extname(file.originalname), &quot;&quot;) + '-' + Date.now() + path.extname(file.originalname))
  }
})*/
 
//var upload = multer({ storage: storage })

app.use(function(req, res, next) {

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
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.get('/', function(req, res) {
    var data = {
        "Data": ""
    };
    data["Data"] = "Welcome to GET & POST request Demo..";
    res.json(data);
});
//Admin CURD API CALL-- Start
//Add ,EDit ,Delete and Select Employees -Start
app.get('/fetchdata', function(req, res) {
    var data = {
        "Data": ""
    };

    connection.query("SELECT * from hs_hr_employee", function(err, rows, fields) {
        if (rows.length != 0) {
            //data["Data"] = rows;
            res.json(rows);
        } else {
            data["Data"] = 'No data Found..';
            res.json(data);
        }
    });
});
app.get('/fetchonedata/:emp_number', function(req, res) {
    var enumber = req.params.emp_number;
    var data = {
        emp_number: enumber
    };

    connection.query("SELECT * from hs_hr_employee where ?", data, function(err, rows, fields) {
        if (rows.length != 0) {
            //data["Data"] = rows;
            res.send(rows);
        } else {
            data["Data"] = 'No data Found..';
            res.send(data);
        }
    });
});
app.post('/insertEmployee', function(req, res) {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var enumber = req.body.enumber;
    var data = {
        emp_number: enumber,
        emp_firstname: fname,
        emp_lastname: lname
    };
    //connection.query('insert into hs_hr_employee (emp_number,emp_firstname,emp_lastname) value ( '+connection.escape(enumber)+','+connection.escape(fname)+','+connection.escape(lname)+')',function(err, rows, fields){
    connection.query('insert into hs_hr_employee SET ?', data, function(err, rows, fields) {
        if (err) {
            res.send(err);

        } else {
            data["Data"] = "Employee added Successfully..";
            res.json(data);
        }

    });
});
app.put('/updateEmployee/:emp_number', function(req, res) {
    var enumber = req.params.emp_number;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var data = {
        emp_firstname: fname,
        emp_lastname: lname
    };
    connection.query('update hs_hr_employee SET ? WHERE emp_number=' + enumber + '', data, function(err, rows, fields) {
        // body...
        if (err) {
            res.send(err);

        } else {
            data["Data"] = "Employee updated Successfully..";
            res.json(data);
        }
    });
});
app.delete('/deleteEmployee/:emp_number', function(req, res) {
    // body...
    var enumber = req.params.emp_number;
    var data = {
        emp_number: enumber
    };
    connection.query('delete from hs_hr_employee where ?', data, function(rows, fields, err) {
        // body...
        if (err) {
            res.send(err)
        } else {
            data["Data"] = "Employee deleted Successfully..";
            res.json(data);
        }
    });
});
//Add ,EDit ,Delete and Select Employees -End

//Add ,EDit ,Delete and Select Expense Type -Start
app.get('/expenseType', function(req, res) {
    // body...var
    data = {
        "Data": ""
    };
    connection.query('select * from tbl_expense_type', function(err, rows, fields) {
        // body...
        if (rows.length != 0) {
            res.json(rows);
        } else {
            data["Data"] = 'No data Found..';
            res.json(data);
        }
    });

});
app.get('/expenseType/:id', function(req, res) {
    // body...
    var expenseTypeID = req.params.id;
    data = {
        id: expenseTypeID
    }

    connection.query('select * from tbl_expense_type where ?', data, function(err, rows, fields) {
        // body...
        if (rows.length != 0) {
            res.json(rows);
        } else {
            data["Data"] = 'No data Found..';
            res.json(data);
        }
    });
});
//app.post('/insertExpenseType', function(req, res) {
app.post('/expenseType', function(req, res) {
    // body...
    var expenseTypeName = req.body.expenseName
    data = {
        expenseName: expenseTypeName
    };
    connection.query('insert into tbl_expense_type SET ?', data, function(err, rows, fields) {
        if (err) {
            res.send(err);

        } else {
            data["Data"] = "Expense type added Successfully..";
            res.json(data);
        }

    });

});
app.put('/expenseType/:id', function(req, res) {
    // body...
    var id = req.params.id;
    var ename = req.body.expenseName;
    var data = {
        expenseName: ename
    };
    connection.query('update tbl_expense_type SET ? WHERE id=' + id + '', data, function(err, rows, fields) {
        // body...
        if (err) {
            res.send(err);

        } else {
            data["Data"] = "Expense updated Successfully..";
            res.json(data);
        }
    });

});
app.delete('/expenseType/:id', function(req, res) {
    // body...
    data = {
        "Data": ""
    };
    var id = req.params.id;
    //connection.query('delete from tbl_expense_type where ?',data,function (argument) {
    connection.query('delete from tbl_expense_type where id=' + id + '', function(err, rows, fields) {
        // body...
        if (err) {
            res.send(err);
        } else {
            data["Data"] = "Expense deleted Successfully..";
            res.json(data);
        }
    });

});
//Add ,EDit ,Delete and Select Expense Type -End
//Admin CURD API CALL-- End

//Employee CRUD API CAll--Start
//Add,Edit,Delete and Select Expense -Start
app.get('/expense',function (req,res) {
	// body...
	data={
		"Data":''
	};
	connection.query('select * from tbl_employee_expenses',function (err,rows,fields) {
		// body...
		if(rows.length!=0)
		{
			res.json(rows);
		}
		else
		{
			data["Data"] = 'No data Found..';
            res.json(data);
		}
	});
});
app.get('/expense/:id',function (req,res) {
	// body...
});
app.post('/expense',function (req,res) {
	// body...
});
app.put('/expense/:id',function (req,res) {
	// body...
});
app.delete('/expense/:id',function (req,res) {
	// body...
});

//Add,Edit,Delete and Select Expense -End

//Employee CRUD API Call--END


app.post('/login', function(req, res) {
    var email = req.body.email;
    var pass = req.body.password;
    var data = {
        "Data": ""
    };
    connection.query("SELECT * from hs_hr_employee WHERE email=? and password=? LIMIT 1", [email, pass], function(err, rows, fields) {
        if (rows.length != 0) {
            data["Data"] = "Successfully logged in..";
            res.json(data);
        } else {
            data["Data"] = "Email or password is incorrect.";
            res.json(data);
        }
    });
});

http.listen(8082, function() {
    console.log("Connected & Listen to port 8082");
});