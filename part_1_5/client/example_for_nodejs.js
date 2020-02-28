//(1-5) for node.js
console.log('example of (1-5)');

const {Tom} = require('../mylib.min.js');
const tom = new Tom();
console.log(tom.sayHello());//-> Hi, I am Tom.
