// requires fs to use file sync
fs = require('fs');

// assign to variable to make it flexible
var filename = 'user_data.json';

// open and read filename
// blocking function (synchronously): function will completely be done before any other code is executed
// utf-8 encoding format
// assign it to data
data = fs.readFileSync(filename, 'utf-8');

// converts data into an object
users_reg_data = JSON.parse(data);

// outputs object to console
console.log(users_reg_data.itm352.password);