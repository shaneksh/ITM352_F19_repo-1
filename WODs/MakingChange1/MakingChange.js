 var changeDue = 765;

 // Quarters
 function quarters() {
     var Qcount = 0;
     while (changeDue >= 25) {
         Qcount = Qcount + 1;
         changeDue = changeDue - 25;
     }
     console.log(`Quarters ` + Qcount);
 }
 
 // Dimes
 function dimes() {
     var Dcount = 0;
     while (changeDue >= 10) {
         Dcount = Dcount + 1;
         changeDue = changeDue - 10;
     }
     console.log(`Dimes ` + Dcount);
 }
 
 // Nickels
 function nickels() {
     var Ncount = 0;
     while (changeDue >= 5) {
         Ncount = Ncount + 1;
         changeDue = changeDue - 5;
     }
     console.log(`Nickels ` + Ncount);
 }
 
 // Pennies
 function pennies() {
     var Pcount = 0;
     while (changeDue >= 1) {
         Pcount = Pcount + 1;
         changeDue = changeDue - 1;
     }
     console.log(`Pennies ` + Pcount);
 }
 
 quarters();
 dimes();
 nickels();
 pennies();