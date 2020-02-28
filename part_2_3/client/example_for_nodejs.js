//(2-3) for node.js
console.log('example of (2-3)');

{
    const Lib = require('../mylib.min.js');

    const Tom = Lib.default;
    const Jack = Lib.Jack;

    const tom = new Tom();
    const jack = new Jack();

    console.log(tom.sayHello());//-> Hi, I am Tom.
    console.log(jack.sayHello());//-> Hi, I am Jack.
}

// Also works with the following code
{
    const Tom = require('../mylib.min.js').default;
    const {Jack} = require('../mylib.min.js');

    const tom = new Tom();
    const jack = new Jack();

    console.log(tom.sayHello());//-> Hi, I am Tom.
    console.log(jack.sayHello());//-> Hi, I am Jack.
}