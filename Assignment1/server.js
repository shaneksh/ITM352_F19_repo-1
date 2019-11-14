// Source: Lab 13

// initialize express
var express = require('express');
var app = express();

// require to get data from body
var myParser = require("body-parser");
var products = require ("./public/products.js");
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
    var hasValidQuantities = true;
    var hasPurchases = false;
    for (i = 0; i < products.length; i++) {
        q = POST ['quantity' +i];
        if (isNonNegInt(q) == false){
            hasValidQuantities = false;
        }
        if (q>0) {
            hasPurchases = true;
        }
    }
    // valid data = invoice
    // unvalid data = error
     qString = querystring.stringify (POST);
     if (hasValidQuantities == true && hasPurchases == true) {
       
        response.redirect ("./invoice.html?" + qString );
    }
    else {
        response.redirect ("./products_page.html?" + qString); 
    }

    // Source: Lab 13 order_page.html
    if (typeof POST['quantity_textbox'] != 'undefined') {
        displayPurchase(POST, response);

    }
});

// looks in public for response to GET
app.use(express.static('./public'));

// sets server to listen on localhost:8080
app.listen(8080, () => console.log(`listening on port 8080`));

// Source: Lab 13 order_page.html
/// validates string is a non-negative integer
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (q== '') {q=0};  // for quantities not inputted
    if (Number(q) != q) errors.push('Not a number!'); // checks for non-numbers
    if (q < 0) errors.push('Negative value!'); // checks for negative numbers
    if (parseInt(q) != q) errors.push('Not an integer!'); // checks for non-integers
    return returnErrors ? errors : (errors.length == 0); // returns error if any

}
// Source: Lab 13 order_page.html
function displayPurchase(POST, response) {

    // Exercise 2b. Does not rewrite page if input is a NonNegInt
    if (isNonNegInt(POST['quantity_textbox'])) {
        response.send(`Thank you for purchasing ${q} things!`); 
    }
    else {
        response.send(`${q} is not a quantity! Press the back button and try again.`); 
    }
}