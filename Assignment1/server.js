var express = require('express');
var app = express();
var myParser = require("body-parser");
var products = require ("./public/products.js");
const querystring = require('querystring');


app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

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
    //if data is valid give user an invoice, if not give them an error
     qString = querystring.stringify (POST);
     if (hasValidQuantities == true && hasPurchases == true) {
       
        response.redirect ("./invoice.html?" + qString );
    }
    else {
        response.redirect ("./products_page.html?" + qString); 
    }

  
    //cut and pasted from order_page copy.htmlf
    if (typeof POST['quantity_textbox'] != 'undefined') {
        displayPurchase(POST, response);

    }
});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

//copied from order_page
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (q== '') {q=0};
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);

}
// cut and pasted from order_page copy
function displayPurchase(POST, response) {

    // Exercise 2b. Does not rewrite page if input is a NonNegInt
    if (isNonNegInt(POST['quantity_textbox'])) {
        response.send(`Thank you for purchasing ${q} things!`); 
    }
    else {
        response.send(`${q} is not a quantity! Press the back button and try again.`); 
    }
}