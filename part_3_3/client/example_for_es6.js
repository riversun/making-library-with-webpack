//replace console.log with document.write to make the behavior visible
console.log = (m) => {
    document.write(`${m}<br>`);
};

//(3-3) for ES6
import * as Lib from '../mylib.min.js';

const Tom = Lib.Tom;
const Jack = Lib.Jack;

const tom = new Tom();
const jack = new Jack();

console.log(tom.sayHello());//-> Hi, I am Tom.
console.log(jack.sayHello());//-> Hi, I am Jack.