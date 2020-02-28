//(2-1) for node.js
console.log('example of (2-1)');

const {Tom, Jack} = require('../mylib.min.js');

const tom = new Tom();
const jack = new Jack();

console.log(tom.sayHello());//-> Hi, I am Tom.
console.log(jack.sayHello());//-> Hi, I am Jack.

// Also works with the following code
const Lib = require('../mylib.min.js');

const Tom2 = Lib.Tom;
const Jack2 = Lib.Jack;

const tom2 = new Tom2();
const jack2 = new Jack2();

console.log(tom2.sayHello());//-> Hi, I am Tom.
console.log(jack2.sayHello());//-> Hi, I am Jack.
