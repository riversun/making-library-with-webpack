//(1-1) for node.js
console.log('example of (1-1)');

const Lib = require('../mylib.min.js');
const Tom = Lib.default;
const tom = new Tom();
console.log(tom.sayHello());//-> Hi, I am Tom.

// Also works with the following code
const Tom2 = require('../mylib.min.js').default;
const tom2 = new Tom2();
console.log(tom2.sayHello());//-> Hi, I am Tom.
