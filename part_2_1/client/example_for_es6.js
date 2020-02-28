//replace console.log with document.write to make the behavior visible
console.log = (m) => {
    document.write(`${m}<br>`);
};

//(2-1) for ES6
import * as Lib from '../mylib.min.js';

const Tom = Lib.Tom;
const Jack = Lib.Jack;

const tom = new Tom();
const jack = new Jack();

console.log(tom.sayHello());//-> Hi, I am Tom.
console.log(jack.sayHello());//-> Hi, I am Jack.


// Also works with the following code
// (Using destructuring assignment)
import {Tom2, Jack2} from '../mylib.min.js';

const tom2 = new Tom2();
const jack2 = new Jack2();

console.log(tom2.sayHello());//-> Hi, I am Tom.
console.log(jack2.sayHello());//-> Hi, I am Jack.

