//replace console.log with document.write to make the behavior visible
console.log = (m) => {
    document.write(`${m}<br>`);
};

//(3-4) for ES6
import Tom from '../mylib.min.js';
const tom = new Tom();
console.log(tom.sayHello());//-> Hi, I am Tom.

