// requires fs to use file sync
fs = require('fs');

// initialize express
var express = require('express');
var app = express();

// require to get data from body
var myParser = require("body-parser");

// looks in public for response to GET
app.use(express.static('./public'));

// requires to get data from products array
var products = require('./public/product_data');

// for parsing and formatting URL query strings
const querystring = require('querystring');

// enables a response 
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

// processes form to POST into invoice
app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request, response) {
    let POST = request.body;
    var hasValidQuantities = true; // assume all quantities are valid
    var hasPurchases = false; // assume quantities are false
    // loop through products.js array
    for (i = 0; i < products.length; i++) {
        q = POST['quantity' + i];
        if (isNonNegInt(q) == false) {
            hasValidQuantities = false;
        }
        if (q > 0) {
            hasPurchases = true;
        }
    }
    // valid data = invoice
    // unvalid data = error
    qString = querystring.stringify(POST); // post string

    // validates ValidQuantities and hasPurchases 
    if (hasValidQuantities == true && hasPurchases == true) {
        // redirects to invoice page  
        response.redirect("./login?" + qString);
    }
    // if not valid, redirects back to product display
    else {
        response.redirect("./products_display.html?" + qString);
    }
});

// Source: Lab 13 order_page.html
/// validates string is a non-negative integer
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (q == '') { q = 0 };  // for quantities not inputted
    if (Number(q) != q) errors.push('Not a number!'); // checks for non-numbers
    if (q < 0) errors.push('Negative value!'); // checks for negative numbers
    if (parseInt(q) != q) errors.push('Not an integer!'); // checks for non-integers
    return returnErrors ? errors : (errors.length == 0); // returns error if any

}

// assign to variable to make it flexible
var filename = './public/user_data.json';

// makes sure file exists before loading it in
// if exists, read it
if (fs.existsSync(filename)) {

    // stat gives a bunch of stats of data
    stats = fs.statSync(filename);
    // size tells how much characters
    console.log(filename + ' has ' + stats.size + ' characters');

    // open and read filename
    // blocking function (synchronously): function will completely be done before any other code is executed
    // utf-8 encoding format
    // assign it to data
    data = fs.readFileSync(filename, 'utf-8');

    // converts data into an object
    users_reg_data = JSON.parse(data)

    // outputs object to console (dumps all the users_reg_data into console)
    console.log(users_reg_data);
} else {
    // give alert if file does not exist
    console.log(filename + 'does not exist!');
}

// if server gets a GET request to login executes login form
// form makes a login page
// goes to localhost:8080/login because that's the path we assigned it to
app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">

</form>
<form action="/register" action="/register" method="GET">
    <button class="float-left submit-button" >Register</button>
</form>
</body>
    `;
    response.send(str);
});

// if server gets a POST request to login
app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    // assigns username of body to a function
    the_username = request.body.username;
    // if username given is not undefined (checks if it exists)
    if (typeof users_reg_data[the_username] != 'undefined') {
        // then get the password from json data, and check if it the same as password entered

        if (users_reg_data[the_username].password == request.body.password) {
            // if passwords match, sends this message

            // use redirect to redirect them to invoice instead in Assignment 2
            // Assignment 2: greet them by saying like "Hi" + the_username + "! Welcome back!"
            response.redirect("./invoice.html?" + qString);
        } else {
            // get request to that
            // for assignment 2 you can add an alert like "Please try again, username or password does not match."
            // can make it sticky by adding their username back in so they don't have to retype it
            // can also regenrate page by making the form a function then push an error message into that
            response.redirect('/login');
        }
    }
});

// gets /register to make a form for users to register a username
app.get("/register", function (request, response) {
    // Give a simple register form
    // for assignment 2 add a box for full name
    str = `
<body>
<form action="" method="POST">
<input type="text" name="full name" size="40" placeholder="enter full name"><br />
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="confirm_password" size="40" placeholder="enter password again"><br />
<input type="email" name="email" size="40" placeholder="enter email"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/register", function (request, response) {
    // process a simple register form

    // validate registartion data
    // make sure full name is only letters

    // make sure username is unique

    // makes sure passwords match

    // when its all good save the new user
    // gets username inputted in the form
    username = request.body.username;
    // empty object makes newuser a property of the array
    users_reg_data[username] = {};
    // password and email values
    users_reg_data[username].password = request.body.password;
    users_reg_data[username].email = request.body.email;

    // adds the submitted form data to users_reg_data then saves this updated object to user_data.json
    fs.writeFileSync(filename, JSON.stringify(users_reg_data));

    // for assignment 2 send them to the invoice with the quanitity data and the username
    response.send(`${username} registered!`)


});

// sets server to listen on localhost:8080
app.listen(8080, () => console.log(`listening on port 8080`));