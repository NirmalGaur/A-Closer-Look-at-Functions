'use strict';
const airIndia = {
  airline: 'AirIndia',
  code: 'AI',
  bookings: [],
  book(flightNum, passengerName) {
    console.log(
      `${passengerName} booked a seat on ${this.airline} flight ${this.code}${flightNum}`
    );
    this.bookings.push({ flight: `${this.code}${flightNum}`, passengerName }); //add new object to the bookings array
  },
};
airIndia.book(44, 'Leo Messi');

//Suppose AirIndia creats a new airline:
const airBharat = {
  airline: 'AirBharat',
  code: 'AB',
  bookings: [],
};
const book = airIndia.book;
//book(58, 'Cristiano Ronaldo');  << doesn't work bcz book function is now a regular function for which this keyword points to undefined. We need to specify explicitly what the this keyword should point to:
book.call(airBharat, 58, 'Cristiano'); //CALL METHOD calls book function with this keyword set to airBharat
book.call(airIndia, 67, 'Kroos');

//APPLY METHOD, also used to manipulate this keyword, takes an array of arguments:
const flightBook = [121, 'Neymar'];
book.apply(airBharat, flightBook);

//BIND METHOD, unlike call & apply, doesn't call the book function. Instead it returns a new function where this keyword is always set to its first paramter, that is the object to which this keyword points to:
let bookAB = book.bind(airBharat);
bookAB(39, 'Lewandowski');
const bookAI = book.bind(airIndia, 26); //a part of the arguments of the original function (before .bind) can already be set in the bind method
bookAI('Benzema');
bookAB = book.bind(airBharat, 48, 'Pique');
bookAB();

//Another Used case of bind method, object method with event listeners:
airIndia.numOfPlanes = 300;
airBharat.numOfPlanes = 200;
airIndia.buyPlane = function () {
  console.log(this);
  this.numOfPlanes++;
  console.log(this.numOfPlanes);
};
//In an event handler function, this keyword always points to the element on which that handler is attached to.
document
  .querySelector('.buy')
  .addEventListener('click', airIndia.buyPlane.bind(airBharat)); //airIndia.buyPlane.bind(airBharat) returns airIndia.buyPlane() function, having this keyword pointing to airBharat object

//bind method for PARTIAL APPLICATION: here we are not interested in this keyword, but we still use bind
const addTax = function (taxRate, value) {
  return value + value * taxRate;
};
console.log(addTax(0.1, 200));
const addVat = addTax.bind(null, 0.25); //set this keyword to null, preset taxRate argument of addTax to 0.25
console.log(addVat(200)); //Note that this is different from setting default parameters bcz here we are creating a new & more specific function based on a more general function

//Implementing Above logic using HIGHER ORDER/ CALLBACK FUNCTIONS:
const addTaxCallBack = function (taxRate, value) {
  return value + value * taxRate;
};
const addVatHighOrder = function (value, taxFunction) {
  const vatTax = addTaxCallBack(0.5, value); //Call back ftn is not directly called, higher order ftn called it
  console.log(vatTax);
};
addVatHighOrder(100, addTaxCallBack); //Call back function is passed as a value to the Higher order function

//Implementing same logic with FUNCTION RETURNING FUNCTION
const addTaxFuncRtrnFunc = function (taxRate) {
  return function (value) {
    return value + taxRate * value;
  };
};
const addVat2 = addTaxFuncRtrnFunc(0.3);
console.log(addVat2(1000));

//Coding Challenge #1
/*Let's build a simple poll app!
A poll has a question, an array of options from which people can choose, and an array with the number of replies for each option. This data is stored in the starter 'poll' object below.
Your tasks:
1. Create a method called 'registerNewAnswer' on the 'poll' object. The method does 2 things:
1.1. Display a prompt window for the user to input the number of the selected option. The prompt should look like this:
What is your favourite programming language?
0: JavaScript
1: Python
2: Rust
3: C++
(Write option number)
1.2. Based on the input number, update the 'answers' array property. For example, if the option is 3, increase the value at position 3 of the array by 1. Make sure to check if the input is a number and if the number makes sense (e.g. answer 52 wouldn't make sense, right?)
2. Call this method whenever the user clicks the "Answer poll" button.
3. Create a method 'displayResults' which displays the poll results. The method takes a string as an input (called 'type'), which can be either 'string' or 'array'. If type is 'array', simply display the results array as it is, using console.log(). This should be the default option. If type is 'string', display a string like "Poll results are 13, 2, 4, 1".
4. Run the 'displayResults' method at the end of each 'registerNewAnswer' method call.
5. Bonus: Use the 'displayResults' method to display the 2 arrays in the test data. Use both the 'array' and the 'string' option. Do not put the arrays in the poll object! So what should the this keyword look like in this situation?
Test data for bonus:
§ Data 1: [5, 2, 3]
§ Data 2: [1, 5, 3, 9, 6, 1] */
console.log('CODING CHALLENGE 1:');
const poll = {
  question: 'What is your favourite programming language?',
  options: ['0: JavaScript', '1: Python', '2: Rust', '3: C++'],
  answers: new Array(4).fill(0), // This generates [0, 0, 0, 0]
  registerNewAnswer() {
    const answerToPrompt = Number(
      prompt(`${this.question}
    \n${this.options.join('\n')}
    \n(Write option number)`)
    );
    typeof (answerToPrompt === 'number') &&
      answerToPrompt >= 0 &&
      answerToPrompt <= 3 &&
      this.answers[answerToPrompt]++;
    this.displayResults('string');
  },
  displayResults(typeOfDisplayOutput) {
    (typeOfDisplayOutput === 'string' &&
      (console.log(`Poll results are ${[...this.answers]}`) || true)) ||
      console.log(this.answers);
  },
};
document
  .querySelector('.poll')
  .addEventListener('click', poll.registerNewAnswer.bind(poll));
//Bonus:
const data1 = {
  answers: [5, 2, 3],
};
const displayData1 = poll.displayResults.bind(data1);
displayData1('array');
const data2 = {
  answers: [1, 5, 3, 9, 6, 1],
};
const displayData2 = poll.displayResults.bind(data2);
displayData2('string');

/* IIFE Immediately Invoked Functions: a function that is only executed once, And then never again. Basically a function that disappears right after it's called once.*/
(function () {
  console.log("This won't run again");
})(); // Without parenthesis around, this is just a function statements. Otherwise it's function expression.
//So we can immediately call it using ()

//CLOSURES IN FUNCTIONS:
/* Closure is like a backpack that function carries around wherever it goes. This backpack has all variables that were present in the VARIABLE ENVIRONMENT OF THE EXECUTION CONTEXT WHERE THAT FUNCTION WAS CREATED. 
So whenever a variable can't be found in the function scope, JavaScript will look into the backpack and take the missing variable from there. 
We cannot just reach into a closure and take variables from it, because a closure is just an internal property of a function. */

const secureBooking = function () {
  let passengerCount = 0;
  return function () {
    passengerCount++;
    console.log(`${passengerCount} passengers`);
  };
};
// Initially, our code is running in the global execution context. And in there, we currently only have secureBooking function.

const booker = secureBooking(); //Here we call secureBooking function, So a new execution context is put on top of the execution stack. Now, each execution context has a variable environment, which contains all its local variables (here it only contains the passengerCount set to zero).
//Now secureBooking finish execution and returns a function which is stored in the booking. Its execution context pops off the stack and disappears.

booker(); // Here we see the closure in action. A closure gives a function access to all the variables of its parent function, even after that parent function has returned. So the function keeps a reference to its outer scope even after that outer scope is gone.

//the booker function was created/born in the execution context of securebooking, therefore it will get access to variable environment of securebooking, even when the execution context of secureBooking is gone from the call stack. So in a sense, the scope chain is actually preserved through the closure, even when a scope has already been destroyed.
//If a variable is not in the current scope, JavaScript will immediately look into the closure And it does this even before looking at the scope chain.
booker();
booker();
//we can take a look on the closer by doing:
console.dir(booker); //here in the internal property (in double square brackets) called scopes, which is basically the variable environment of the bokker function, we can see the closure coming from secureBooking

//Other Examples on Closure:
let f;
const g = function () {
  const a = 23;
  f = function () {
    console.log(a * 2);
  };
};
g();
f(); // f variable wasn't even created inside g(), it was created in the global scope. But then as we assigned it in the g function, f still closed over the variable environment of the g function, hence able to access variable a inside g even after g finished executing.
// As we reassign the function to a new value, then that old closure basically disappears.
// If we would've called f before calling g, it shows the error:  f is not a function, bcz it's assigned a function value only when g is called.

// Closure in case of timer fuction:
const boardPassengers = function (numPassengers, waitTimeInSeconds) {
  const passengerPerGroup = numPassengers / 3;

  setTimeout(function () {
    console.log(`We are now boarding all ${numPassengers} passengers`);
    console.log(
      `There are 3 groups, each with ${passengerPerGroup} passengers`
    );
  }, waitTimeInSeconds * 1000);
  //the first agrument of the timer function is the callback function that would be executed after a certain time, and the second argument is that time in milliseconds.
  console.log(`We will start boarding in ${waitTimeInSeconds} seconds`);
};
const passengerPerGroup = 1000;
boardPassengers(180, 3); //And again, the callback function was executed independently from the board passengers function, but still it was able to use all the variables that were in the variable environment in which it was created.  This is a clear sign of a closure being created.
// Even though we recreat the variable passengerPerGroup in global scope (Line 195), callback function still uses the passengerPerGroup value from boardPassengers function's variable environment. This shows that closer has the priority over the scope chain.

/*Coding Challenge #2
This is more of a thinking challenge than a coding challenge 
Your tasks:
1. Take the IIFE below and at the end of the function, attach an event listener that changes the color of the selected h1 element ('header') to blue, each time the body element is clicked. Do not select the h1 element again! 
2. Think about when exactly the callback function is executed, and what that means for the variables involved in this example*/

(function () {
  const header = document.querySelector('h1');
  header.style.color = 'red';
  document.querySelector('body').addEventListener('click', function () {
    header.style.color = 'blue';
  });
})(); //Here the IIFE is called directly and its execution context is gone at the moment, but still the eventlistner function is able to access the header varible because of the closure property.
