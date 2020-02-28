//replace console.log with document.write to make the behavior visible
console.log = (m) => {
    document.write(`${m}<br>`);
};

//(1-1) for ES6
import * as Lib from '../mylib.min';

const Tom = Lib.default;
const tom = new Tom();
console.log(tom.sayHello());


// Also works with the following code
import {default as Tom2} from '../mylib.min';

const tom2 = new Tom2();
console.log(tom2.sayHello());

// Also works with the following code
import Tom3 from '../mylib.min';

const tom3 = new Tom3();
console.log(tom3.sayHello());
