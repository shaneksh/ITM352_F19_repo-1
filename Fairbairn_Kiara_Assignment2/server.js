//from Lab 13 and Ports Office Hours
var express = require('express'); //requires the express package in the node_modules
var app = express(); //starts express
var myParser = require("body-parser"); //need to use bodyParser() to form data to be available in req.body
var products = require("./public/product_data.js"); //defines the products variable and gets data from the product_data.js array
const querystring = require('querystring'); //gives utilities for parsing and formatting URL query strings

app.use(myParser.urlencoded({ extended: true }));
fs = require('fs');
var filename = 'user_registration_info.json';

app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

//from Lab 13 and Ports Office Hours
app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request, response) {
    let POST = request.body; //
    var hasValidQuantities = true; //defining the hasValidQuantities variable and assuming all quantities are valid
    var hasPurchases = false; //assume the quantity of purchases are false
    for (i = 0; i < products.length; i++) { //for loop for each product array that increases the count by 1
        q = POST['quantity' + i]; //quantity entered by the user for a product is aessigned into q
        if (isNonNegInt(q) == false) { //if the quantity enetered by the user is invalid integer
            hasValidQuantities = false; //hasValidQuantities is false or nothing was inputed in the quantity textbox
        }
        if (q > 0) { //if quantity entered in the textbox is greater than 0
            hasPurchases = true; //if q is greater than 0 than the hasPurchases is ok
        }
    }
    //if data is valid give user an invoice, if not give them an error
    qString = querystring.stringify(POST); //string query together
    if (hasValidQuantities == true && hasPurchases == true) { //if both hasValidQuantities variable and hasPurchases variable are valid 
        response.redirect('./login_page.html?' + qString); //if quantity is valid it will send user to invoice
    }
    else {
        response.redirect("./products_display.html?" + qString); //if quantity is invalid it will send user back to products page
    }
});


//taken from Lab 13
app.use(express.static('./public'));  //takes get request and look for file in public directly
app.listen(8080, () => console.log(`listening on port 8080`)); //makes the server listen on Port 8080 and print smessage into console

//copied from order_page
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (q == '') { q = 0 }; //if quantity is empty or 0
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0); //returns error if any
}

//
//check to see if the file exists. if it does, read it and parse it. if not output a message
if (fs.statSync(filename)) {

    //returns contents of the path
    data = fs.readFileSync(filename, 'utf-8');

    stats = fs.statSync(filename);
    console.log(filename + ' has ' + stats.size + ' characters'); //console logs the filename with the amount of characters it has


    users_reg_data = JSON.parse(data);//parses the data into JSON format
    /*
    username = 'newuser';
    users_reg_data[username] = {}; //new user becomes new property of users_reg_data object
    users_reg_data[username].password = 'newpass';
    users_reg_data[username].email = 'newuser@user.com';
    fs.writeFileSync(filename, JSON.stringify(users_reg_data));
    */

    console.log(users_reg_data); //console logs

} else {
    console.log(filename + ' does not exist');
}


//gets called with data from the form
app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    var qString = querystring.stringify(request.query);
    inputUser= request.body.username;
    inputPass = request.body.password;
    the_username = request.body.username.toLowerCase(); //give me username from object and assigning it
    
    
    if (typeof users_reg_data[the_username] != 'undefined') { //ask object if it has property called username, if it does, it wont be udefined. check to see if it exists
        if (users_reg_data[the_username].password == request.body.password) {//check if the password they entered matches what was stored
            //passes the username + the string logged in on the page to greet them
            
            presentFullName= users_reg_data[the_username].name;
            stickPut = presentFullName;
            request.query.stickMe2 = stickPut;
            qString = querystring.stringify(request.query);
            response.redirect("./invoice.html?" + qString);//if the quantity is valid, user is directed to invoice along with the query data from the form
        } else if (users_reg_data[the_username].password != request.body.password) {
            error = "Incorrect Password";
            stickInput = inputUser;
            //if they did not login successfully, does another get request and redirects user to login to page
            //can regnerate form here and display errors
        }
    } else {
        error = the_username + " is not registered";
        stickInput = inputUser
    }
request.query.LoginError = error;
request.query.stickies = stickInput;
qString = querystring.stringify(request.query);
response.redirect("./login_page.html?" + qString);
});



app.post("/register", function (request, response) {
    // process a simple register form

    //validate registration data
    //all good, so save new user to the file name(registration data)
    username = 'newuser';
    username = request.body.username.toLowerCase(); //makes the username insensitive
    fullname = request.body.fullname;


    var qString = querystring.stringify(request.query);
    regInputUser = request.body.username;
    regInputPass = request.body.password;
    regFullName = request.body.fullname;
    regPassword = request.body.password;
    regRepPassword = request.body.repeat_password;
    regEmail = request.body.email;
    email =request.body.email.toLowerCase();
    if (typeof users_reg_data[username] != 'undefined') {//check if the password they entered matches what was stored
        //response.redirect('./login.html?' + qString);//if they did not login successfully, does another get request and redirects user to login to page
        //can regnerate form here and display errors
    } else if (request.body.fullname.length > 30){
        //response.send('your name is too damn long, shorten it');
        errors2='fullname is too long';
        stickType = regFullName;
    } else if (!(/^[A-Za-z ]+$/.test(fullname))){
        errors2='name must be letters only';
        stickType = regFullName;
    } else if (request.body.password.length < 6){
        errors2='password must be more than 6 characters long';
    } else if (request.body.repeat_password != request.body.password) {
        errors2='password does not match';
    } else if (!(/^[a-zA-Z0-9]+$/.test(username))) { //kiara's siter in law
        errors2='useusername must be characters and numbers only';
        stickType = regInputUser;
    } else if (username.length > 10 ){
        errors2='username is too long';
        stickType = regInputUser
    } else if (username.length < 4) {
        errors2='username is too short';
        stickType = regInputUser;
    } else if (!(/^[a-zA-Z0-9._]+@[a-zA-Z.]+\.[a-zA-Z]{2,3}$/.test(email))){
        errors2='email is invalid';
        stickType = regEmail;
    }
    else {   
        users_reg_data[username] = {}; //new user becomes new property of users_reg_data object
        users_reg_data[username].name = request.body.fullname;
        users_reg_data[username].password = request.body.password;
        users_reg_data[username].email = request.body.email;
        fs.writeFileSync(filename, JSON.stringify(users_reg_data));
        //alert(`${username} registered!`)
        
        stickType2 = regFullName;
        request.query.stickMe2 = stickType2; 
        qString = querystring.stringify(request.query);
        response.redirect("./invoice.html?" + qString);
    
        //response.redirect ("./invoice.html?" + qString );//if the quantity is valid, user is directed to invoice along with the query data from the form

        console.log(request.body);
}   
    request.query.RegisterError = errors2;
    request.query.stickMe = stickType;
    qString = querystring.stringify(request.query);
    response.redirect("./registration.html?" + qString);    

});


