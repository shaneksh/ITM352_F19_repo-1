var express = require('express'); //requires the express package in the node_modules
var app = express(); //starts express
var myParser = require("body-parser"); //need to use bodyParser() to form data to be available in req.body
var products = require("./public/charges_display.js"); //defines the products variable and gets data from the product_data.js array
const querystring = require('querystring'); //gives utilities for parsing and formatting URL query strings

// sets public as root folder
app.use("/static", express.static('./public/'));

app.use(myParser.urlencoded({ extended: true })); //tells the system to use JSON
fs = require('fs'); //assigns to a fs variable
var filename = './public/staff_data.json'; //assigns information from the staff login info to variable
var patientfile = './invoice_data.json'; // assigns invoice information to a variable

// use middlewear 
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

// use for session storage
var session = require('express-session');

// checks to make sure username exists in staff data
if (fs.statSync(filename)) {

    //returns contents of the path
    data = fs.readFileSync(filename, 'utf-8');

    stats = fs.statSync(filename);
    console.log(filename + ' has ' + stats.size + ' characters'); //console logs the filename with the amount of characters it has


    users_reg_data = JSON.parse(data);//parses the data into JSON format

    console.log(users_reg_data);
    //if file doesnt exist this will tell the user that it doesnt

} else {
    console.log(filename + ' does not exist'); //shows the wrong file name + doesnt exist in the message
}

// checks to make sure 
if (fs.statSync(patientfile)) {

    //returns contents of the path
    patient_data = fs.readFileSync(patientfile, 'utf-8');

    stats = fs.statSync(patientfile);
    console.log(patientfile + ' has ' + stats.size + ' characters'); //console logs the filename with the amount of characters it has
    invoice_reg_data = JSON.parse(data);//parses the data into JSON format

    console.log(users_reg_data);

// validation for staff login
app.post("./login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body); //diagnostic to see in terminal
    inputUser = request.body.username;
    inputPass = request.body.password;
    staff_name = request.body.name.toLowerCase(); //give me username from object and assigning it

    if (typeof users_reg_data[staff_name] != 'undefined') { //ask object if it has property called username, if it does, it wont be udefined. check to see if it exists
        if (users_reg_data[staff_name].password == request.body.password) {//check if the password they entered matches what was stored
            //assigns the username, email and full name into variables
            presentFullName = users_reg_data[staff_name].name;
            //set those variables into another variable
            stickPut = presentFullName;
            //retrieve variable values
            request.query.stickMe2 = stickPut;
            //strings query together
            response.redirect("./charges.html") // redirects to enter charges page if login is succesful
        }
        //else if the password of the user name in JSON does not match the password entered
        else if (users_reg_data[staff_name].password != request.body.password) {
            error = "Incorrect Password"; //sets error to incorrect password, which will display on the page 
            stickInput = inputUser; //assigns the username the user entered into a variable which will let it stick 
        }
        //else the username the user entered and error message is displayed 
    } else {
        error = name + " is not registered"; //shows the error when the username entered is not registered
        stickInput = inputUser //assigns the username the user entered into stick input
    }
    //retrive variable values and puts it into query
    request.query.LoginError = error;
    request.query.stickies = stickInput;
    //string query together
    //redirect user back to login page with qString
    response.redirect("./staff.html");
});

// puts invoice information into array
// gets /invoice_register to make a form for staff to bill charges to specific invoice IDs
app.get("/post_invoice", function (request, response) {
    str = `
<body>
<form action="" method="POST">
<input type="text" name="patientname" size="40" placeholder="Enter Patient Name" ><br />
<input type="text" name="invoiceID" size="40" placeholder="Enter Invoice ID"><br />
<input type="text" name="amount" size="40" placeholder="Enter Total Amount Due"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/post_invoice", function (request, response) {
    // define patientname as a variable
    patientname = request.body.patientname;
    // empty object makes newuser a property of the array
    invoice_reg_data[patientname] = {};
    // invoiceID and amount
    invoice_reg_data[patientname].invoiceID = request.body.invoiceID;
    invoice_reg_data[patientname].amount = request.body.amount;

    // adds the submitted form data to users_reg_data then saves this updated object to user_data.json
    fs.writeFileSync(filename, JSON.stringify(invoice_reg_data));

    // for assignment 2 send them to the invoice with the quanitity data and the username
    response.send(`${patientname} charges billed to account!`);
},
console.log(request.body));
}
