// Source: Lab 13

// initialize express
var express = require('express');
var app = express();

// require to get data from body
var myParser = require("body-parser");

// looks in public for response to GET
app.use(express.static('./public'));

// sets server to listen on localhost:8080
app.listen(8080, () => console.log(`listening on port 8080`));

// requires to get data from products.js array
var products = require("./public/products.js");

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
        response.redirect("./invoice.html?" + qString);
    }
    // if not valid, redirects back to product display
    else {
        response.redirect("./products_page.html?" + qString);
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