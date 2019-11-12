var products = require('./product_data.json') 

// initialize express
var express = require('./node_modules/express');
var app = express();

var myParser = require("body-parser");

var fs = require('fs'); 

// add a response
// request method and path concatenated
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request, response) {
    process_quantity_form(request.body, response);
});

// when responding to request, rather then sending it back to the user, it logs it to the console
// sets up a static web server and everytime there is a GET, it looks in public for response
app.use(express.static('./public'));

app.listen(8081, () => console.log(`listening on port 8081`));

function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);

}

function displayPurchase(POST, response) {
    if (typeof POST['quantity_textbox'] != 'undefined') {
        if (isNonNegInt(q)) {
            var contents = fs.readFileSync('./views/display_template.view', 'utf8');
            response.send(eval('`' + contents + '`')); // render template string
        } else {
            response.send(`${q} is not a quantity!`);
        }
    }
}
function process_quantity_form(POST, response) {
    q = POST['quantity_textbox'];
    if (typeof POST['quantity_textbox'] != 'undefined') {
        displayPurchase(POST, response);
    }
}