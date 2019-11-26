// requires fs to use file sync
fs = require('fs');

// assign to variable to make it flexible
var filename = 'user_data.json';

// makes sure file exists before loading it in
// if exists, read it
if (fs.existsSync(filename)) {

    // stat gives a bunch of stats of data
    stats = fs.statSync(filename);
    // size tells how much characters
    console.log(filename + 'has' + stats.size + 'characters');

    // open and read filename
    // blocking function (synchronously): function will completely be done before any other code is executed
    // utf-8 encoding format
    // assign it to data
    data = fs.readFileSync(filename, 'utf-8');

    // converts data into an object
    users_reg_data = JSON.parse(data);

    // outputs object to console
    console.log(users_reg_data.itm352.password);
} else {
    // give alert if file does not exist
    console.log(filename + 'does not exist!');
}