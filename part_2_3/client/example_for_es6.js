//replace console.log with document.write to make the behavior visible
console.log = (m) => {
    document.write(`${m}<br>`);
};

//(2-3) for ES6
import * as Lib from '../mylib.min.js';

{
    const Tom = Lib.default;
    const Jack = Lib.Jack;

    const tom = new Tom();
    const jack = new Jack();

    console.log(tom.sayHello());//-> Hi, I am Tom.
    console.log(jack.sayHello());//-> Hi, I am Jack.
}


// Also works with the following code

import {default as Tom, Jack} from '../mylib.min.js';

{
    const tom = new Tom();
    const jack = new Jack();

    console.log(tom.sayHello());//-> Hi, I am Tom.
    console.log(jack.sayHello());//-> Hi, I am Jack.
}

// Also works with the following code

import Tom2 from '../mylib.min.js';
import {Jack as Jack2} from '../mylib.min.js';

{
    const tom2 = new Tom2();
    const jack2 = new Jack2();

    console.log(tom2.sayHello());//-> Hi, I am Tom.
    console.log(jack2.sayHello());//-> Hi, I am Jack.
}