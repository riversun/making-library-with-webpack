
# Recipes on how to create a library using webpack

## About
Introduces how to build a library that **supports both browser and Node.js** using webpack4 and ES6, and how to use the created library.

There are two ways to create a library that supports both browser and node.js.

![image](https://user-images.githubusercontent.com/11747460/75525983-3ae41400-5a54-11ea-9d31-279ee9dd0065.png)

- **One bundle**:  
The first is a method that covers **both browser and Node.js** with one bundle.
In this article, we'll take a closer look at how to create one bundle for both browser and Node.js.

- **Two bundles**:  
The second is to build libraries for browser and node.js separately.

## How to run examples

Step 1.Clone this repository.

Step2.Go to example directory like "part_1_1"

```
cd part_1_1
```
 
Step3.Run 'npm start' after `npm install` to start examples.

```
npm install
npm start
```
 

## 1.One class in the library
### 1-1.Publish an "export default" class.

#### Build configuration

Build configuration is as follows

**family.js** is the source code of the library to be published

**webpack.config.js**

```javascript
entry: {
    'mylib': [`./src/family.js`],
},
output: {
    filename: `[name].min.js`,
    library: '',
    libraryExport: '',
    libraryTarget: 'umd',
    globalObject: 'this',
},
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_1_1/webpack.config.build-lib.js" target="_blank">See full source code of webpack.config.js</a>



#### Source code of the **library**

**family.js** has a class named **Tom** with a single method **sayHello**.
We will see how to turn this into a library.


**family.js**

```javascript
export default class Tom {
    sayHello() {
        return 'Hi, I am Tom.'
    }
}
```

#### Source code for using this library

●Using from **Browser**

```html
<script src="./mylib.min.js"></script>
<script>
    const Tom = window.default;
    const tom = new Tom();
    console.log(tom.sayHello());
</script>
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_1_1/client/example_for_browser.html" target="_blank">Open demo</a>


●Using from **Node.js**

```javascript
const Lib = require('./mylib.min.js');
const Tom = Lib.default;
const tom = new Tom();
console.log(tom.sayHello());//-> Hi, I am Tom.
```

Also works with the following code,

```javascript
const Tom = require('./mylib.min.js').default;
const tom = new Tom();
console.log(tom.sayHello());//-> Hi, I am Tom.
```

●Example of using **ES6's import** statement

```javascript
import * as Lib from './mylib.min.js';
const Tom = Lib.default;
const tom = new Tom();
console.log(tom.sayHello());//-> Hi, I am Tom.
```

Also works with the following code,

```javascript
import {default as Tom} from './mylib.min.js';
const tom = new Tom();
console.log(tom.sayHello());//-> Hi, I am Tom.
```

or

```javascript
import Tom from './mylib.min.js';//Pick default
const tom = new Tom();
console.log(tom.sayHello());//-> Hi, I am Tom.
```

●**Tips** for this recipe

<font color=blue>**Point 1:**</font>What does **globalObject: 'this'** mean?

The webpacked bundle **mylib.min.js** is as follows.

```javascript
(function webpackUniversalModuleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if(typeof define === 'function' && define.amd)
        define([], factory);
    else {
        var a = factory();
        for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
    }
})(this, function() {...});
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_1_1/mylib.develop.js" target="_blank">See full source code of bundle(develop build)</a>

This is an immediate function with `(this, function ())` as its argument.
This `this` is caused by setting **globalObject: 'this'**.
If you do not specify **globalObject:**,
the argument of this immediate function will be `(window, function ())`.
It works on browsers that have a `window` object,
but cannot be run on **node.js** that does not have a **window** object.
As you might expect, if you try the above, you will get `ReferenceError: window is not defined`.
So if you want to support **both browser and node.js**, 
don't forget to include **globalObject: 'this'**.

<font color=blue>**Point 2:**</font>Classes you want to publish are stored with the key "**default**"

If you want to access the classes published in the library,
Use `require('./mylib.min.js').default` on node.js and use `window.default`(=window["default"]) on the browser. 

Remember that in this configuration, the class is identified by the key **default**.

### 1-2.Publish an "export default" class **with library name** (like namespace).

The library name (namespace) can be set by specifying **output.library: 'MyLibrary'** in webpack.config.js.

#### Build Configuration

**webpack.config.js**

```javascript
entry: {
    'mylib': [`./src/family.js`],
},
output: {
    filename: `[name].min.js`,
    library: 'MyLibrary',
    libraryExport: '',
    libraryTarget: 'umd',
    globalObject: 'this',
},
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_1_2/webpack.config.build-lib.js" target="_blank">See full source code of webpack.config.js</a>


#### Source code of the **library**

**family.js**

```javascript
export default class Tom {
    sayHello() {
        return 'Hi, I am Tom.'
    }
}
```

#### Source code for using this library

●Using from **Browser**

See below.
**Tom class** can be used as **MyLibrary.default**.

```javascript
<script src="./mylib.min.js"></script>
<script>
    const Tom = MyLibrary.default;
    const tom = new Tom();
    console.log(tom.sayHello());
</script>
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_1_2/client/example_for_browser.html" target="_blank">Open demo</a>


●Using from **Node.js**

Note that in case of node.js (CommonJS2), <font color=red>library name is ignored </font>.
So **output.library: 'MyLibrary'** does not work for node.js.

```javascript
const Lib = require('./mylib.min.js');
const Tom = Lib.default;
const tom = new Tom();
console.log(tom.sayHello());//-> Hi, I am Tom.
```

●Example of using **ES6's import** statement

```javascript
import * as Lib from './mylib.min.js';
const Tom = Lib.default;
const tom = new Tom();
console.log(tom.sayHello());//-> Hi, I am Tom.
```

### 1-3.Publish an "export default" class **with** library name **without** using the **default property**.

You want to access a class without using "default" which looks redundant like below.

```javascript
const Tom = MyLibrary.default;　
```


#### Build Configuration

Try to set `output.libraryExport: 'default'`

**webpack.config.js**

```javascript
entry: {
    'mylib': [`./src/family.js`],
},
output: {
    filename: `[name].min.js`,
    library: 'MyLibrary',
    libraryExport: 'default',
    libraryTarget: 'umd',
    globalObject: 'this',
},
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_1_3/webpack.config.build-lib.js" target="_blank">See full source code of webpack.config.js</a>

#### Source code of the **library**

**family.js**

```javascript
export default class Tom {
    sayHello() {
        return 'Hi, I am Tom.'
    }
}
```

#### Source code for using this library


●Using from **Browser**

Let's build the library with this configuration.
Then, instead of `MyLibrary.default`,
`MyLibrary` itself equals to a reference of `Tom` class.

```javascript
<script src="./mylib.min.js"></script>
<script>
    const Tom = MyLibrary;
    const tom = new Tom();
    console.log(tom.sayHello());
</script>
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_1_3/client/example_for_browser.html" target="_blank">Open demo</a>


●Using from **Node.js**

As mentioned above, in case of node.js (CommonJS2), <font color=red>library name is ignored </font>.

```javascript
const Tom = require('./mylib.min.js');
const tom = new Tom();
console.log(tom.sayHello());//-> Hi, I am Tom.
```

●Example of using **ES6's import** statement

```javascript
import Tom  from './mylib.min.js';
const tom = new Tom();
console.log(tom.sayHello());//-> Hi, I am Tom.
```

### 1-4.Publish an "export default" class with the setting **"library name = class name"**.


#### Build Configuration

- Set `output.libraryExport: 'default'`
- Make library name the same as class name like `output.library: 'Tom'`

**webpack.config.js**

```javascript
entry: {
    'mylib': [`./src/family.js`],
},
output: {
    filename: `[name].min.js`,
    library: 'Tom',
    libraryExport: 'default',
    libraryTarget: 'umd',
    globalObject: 'this',
},
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_1_4/webpack.config.build-lib.js" target="_blank">See full source code of webpack.config.js</a>


#### Source code of the **library**

**family.js**

```javascript
export default class Tom {
    sayHello() {
        return 'Hi, I am Tom.'
    }
}
```

#### Source code for using this library


●Using from **Browser**

```javascript
<script src="./mylib.min.js"></script>
<script>
    const tom = new Tom();
    console.log(tom.sayHello());
</script>
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_1_4/client/example_for_browser.html" target="_blank">Open demo</a>

●Using from **Node.js**

```javascript
const Tom = require('./mylib.min.js');
const tom = new Tom();
console.log(tom.sayHello());//-> Hi, I am Tom.
```

●Example of using **ES6's import** statement

```javascript
import Tom from './mylib.min.js';
const tom = new Tom();
console.log(tom.sayHello());//-> Hi, I am Tom.
```

●**Tips** for this recipe

It can be accessed from the browser and node.js with the symbol **Tom**.
This configuration is one of my favorites.

### 1-5.Publish an "export default" class in a way called "reexport".

Publish the library using re-export.
Re-export means exporting one module from another.

#### Build Configuration

Change <font color=blue>**entry**</font> to <font color=blue>**index.js**</font> to re-export from index.js.

**webpack.config.js**

```javascript
entry: {
    'mylib': [`./src/index.js`],
},
output: {
    filename: `[name].min.js`,
    library: '',
    libraryExport: '',
    libraryTarget: 'umd',
    globalObject: 'this',
},
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_1_5/webpack.config.build-lib.js" target="_blank">See full source code of webpack.config.js</a>

#### Source code of the **library**

Now, let's create **index.js** and re-export the **Tom class** in **family.js** from there.

```javascript
export {default as Tom} from './family.js';
```

<font color = gray>**Tom** is "**export**"ed by **{default as Tom}** 
when reexporting by index.js. So, strictly speaking, this method is no longer "**default export**".</font>


**family.js**

```javascript
export default class Tom {
    sayHello() {
        return 'Hi, I am Tom.'
    }
}
```

#### Source code for using this library


●Using from **Browser**

```javascript
<script src="./mylib.min.js"></script>
<script>
    const tom = new Tom();
    console.log(tom.sayHello());
</script>
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_1_5/client/example_for_browser.html" target="_blank">Open demo</a>


●Using from **Node.js**

We use [destructuring assignment](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) to get the **Tom** class.

```javascript
const {Tom} = require('./mylib.min.js');
const tom = new Tom();
console.log(tom.sayHello());//-> Hi, I am Tom.

```

●Example of using **ES6's import** statement

```javascript
import {Tom} from './mylib.min.js';
const tom = new Tom();
console.log(tom.sayHello());//-> Hi, I am Tom.
```

## 2.Multiple classes in the library

### 2-1.Publish **multiple classes**

Let's look at some examples of publishing multiple classes.
(You can publish not just classes but functions or variables in the same way.)

#### Source code of the **library**

As you can see, the following **family.js** contains two classes **Tom** and **Jack**.

**family.js**

```javascript
export class Tom {
    sayHello() {
        return 'Hi, I am Tom.'
    }
}
export class Jack {
    sayHello() {
        return 'Hi, I am Jack.'
    }
}
```

#### Build Configuration

**webpack.config.js**

```javascript
entry: {
    'mylib': [`./src/family.js`],
},
output: {
    filename: `[name].min.js`,
    library: '',
    libraryExport: '',
    libraryTarget: 'umd',
    globalObject: 'this',
},
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_2_1/webpack.config.build-lib.js" target="_blank">See full source code of webpack.config.js</a>


#### Source code for using this library

●Using from **Browser**

```javascript
<script src="./mylib.min.js"></script>
<script>
    const tom = new Tom();//means window["Tom"]
    const jack = new Jack();//means window["Jack"]

    console.log(tom.sayHello());//-> Hi, I am Tom.
    console.log(jack.sayHello());//-> Hi, I am Jack.

</script>
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_2_1/client/example_for_browser.html" target="_blank">Open demo</a>


●Using from **Node.js**

```javascript
const {Tom, Jack} = require('./mylib.min.js');

const tom = new Tom();
const jack = new Jack();

console.log(tom.sayHello());//-> Hi, I am Tom.
console.log(jack.sayHello());//-> Hi, I am Jack.
```

Also works with the following code,

```javascript
const Lib = require('./mylib.min.js');

const Tom = Lib.Tom;
const Jack = Lib.Jack;

const tom = new Tom();
const jack = new Jack();

console.log(tom.sayHello());//-> Hi, I am Tom.
console.log(jack.sayHello());//-> Hi, I am Jack.
```

●Example of using **ES6's import** statement

```javascript
import * as Lib from './mylib.min.js';

const Tom = Lib.Tom;
const Jack = Lib.Jack;

const tom = new Tom();
const jack = new Jack();

console.log(tom.sayHello());//-> Hi, I am Tom.
console.log(jack.sayHello());//-> Hi, I am Jack.
```

OR

```javascript
import {Tom, Jack} from './mylib.min.js';

const tom = new Tom();
const jack = new Jack();

console.log(tom.sayHello());//-> Hi, I am Tom.
console.log(jack.sayHello());//-> Hi, I am Jack.
```

### 2-2.Publish multiple classes **with library name**


By specifying `library:'GreatFamily'`, 
you can add a library name (like namespace) like as follows. 

#### Build Configuration

**webpack.config.js**

```javascript
entry: {
    'mylib': [`./src/family.js`],
},
output: {
    filename: `[name].min.js`,
    library: 'GreatFamily',
    libraryExport: '',
    libraryTarget: 'umd',
    globalObject: 'this',
},
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_2_2/webpack.config.build-lib.js" target="_blank">See full source code of webpack.config.js</a>


#### Source code of the **library**

**family.js**

```javascript
export class Tom {
    sayHello() {
        return 'Hi, I am Tom.'
    }
}
export class Jack {
    sayHello() {
        return 'Hi, I am Jack.'
    }
}
```

#### Source code for using this library

●Using from **Browser**

When running on a browser, each class(Tom and Jack) is stored in window ["GreatFamily"].

```javascript
<script src="./mylib.min.js"></script>
<script>
    const tom = new GreatFamily.Tom();
    const jack = new GreatFamily.Jack();

    console.log(tom.sayHello());
    console.log(jack.sayHello());

</script>
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_2_2/client/example_for_browser.html" target="_blank">Open demo</a>


●Using from **Node.js**

Note that in case of node.js (CommonJS2), <font color=red>library name is ignored </font>.
So **output.library: 'GreatFamily'** does not work for node.js.

```javascript
const Lib = require('./mylib.min.js');

const Tom = Lib.Tom;
const Jack = Lib.Jack;

const tom = new Tom();
const jack = new Jack();

console.log(tom.sayHello());//-> Hi, I am Tom.
console.log(jack.sayHello());//-> Hi, I am Jack.
```
　

●Example of using **ES6's import** statement

```javascript
import * as Lib from './mylib.min.js';

const Tom = Lib.Tom;
const Jack = Lib.Jack;

const tom = new Tom();
const jack = new Jack();

console.log(tom.sayHello());//-> Hi, I am Tom.
console.log(jack.sayHello());//-> Hi, I am Jack.
```

　

##2-3.Publish multiple classes including **"export default"** class

#### Source code of the **library**

**family.js**

```javascript
export default class Tom {
    sayHello() {
        return 'Hi, I am Tom.'
    }
}
export class Jack {
    sayHello() {
        return 'Hi, I am Jack.'
    }
}

```

#### Build Configuration

**webpack.config.js**

```javascript
entry: {
    'mylib': [`./src/family.js`],
},
output: {
    filename: `[name].min.js`,
    library: '',
    libraryExport: '',
    libraryTarget: 'umd',
    globalObject: 'this',
},
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_2_3/webpack.config.build-lib.js" target="_blank">See full source code of webpack.config.js</a>

#### Source code for using this library


●Using from **Browser**

```javascript
<script src="./mylib.min.js"></script>
<script>

    const Tom = window.default;//means window["default"]

    const tom = new Tom();
    const jack = new Jack();//means window["Jack"]

    console.log(tom.sayHello());
    console.log(jack.sayHello());

</script>
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_2_3/client/example_for_browser.html" target="_blank">Open demo</a>


●Using from **Node.js**

```javascript
const Lib = require('./mylib.min.js');

const Tom = Lib.default;
const Jack = Lib.Jack;

const tom = new Tom();
const jack = new Jack();

console.log(tom.sayHello());//-> Hi, I am Tom.
console.log(jack.sayHello());//-> Hi, I am Jack.
```

Also works with the following code,

```javascript
const Tom = require('./mylib.min.js').default;
const {Jack} = require('./mylib.min.js');

const tom = new Tom();
const jack = new Jack();

console.log(tom.sayHello());//-> Hi, I am Tom.
console.log(jack.sayHello());//-> Hi, I am Jack.
```

●Example of using **ES6's import** statement

```javascript
import * as Lib from './mylib.min.js';

const Tom=Lib.default;
const Jack=Lib.Jack;

const tom = new Tom();
const jack = new Jack();

console.log(tom.sayHello());//-> Hi, I am Tom.
console.log(jack.sayHello());//-> Hi, I am Jack.
```

or

```javascript
import {default as Tom, Jack} from './mylib.min.js';

const tom = new Tom();
const jack = new Jack();

console.log(tom.sayHello());//-> Hi, I am Tom.
console.log(jack.sayHello());//-> Hi, I am Jack.
```

or

```javascript

import Tom2 from './mylib.min.js';
import {Jack as Jack2} from './mylib.min.js';

const tom2 = new Tom2();
const jack2 = new Jack2();

console.log(tom2.sayHello());//-> Hi, I am Tom.
console.log(jack2.sayHello());//-> Hi, I am Jack.
```

##2-4.Publish only "export default" class from multiple classes.

Here's a rare pattern, but let's take a look to get a better understanding of what happens when building.

#### Build Configuration

**webpack.config.js**

```javascript
entry: {
    'mylib': [`./src/family.js`],
},
output: {
    filename: `[name].min.js`,
    library: 'Tom',
    libraryExport: 'default',
    libraryTarget: 'umd',
    globalObject: 'this'
},
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_2_4/webpack.config.build-lib.js" target="_blank">See full source code of webpack.config.js</a>

#### Source code of the **library**

**family.js**

```javascript
export default class Tom {
    sayHello() {
        return 'Hi, I am Tom.'
    }
}
export class Jack {
    sayHello() {
        return 'Hi, I am Jack.'
    }
}
```


#### Source code for using this library


●Using from **Browser**

<font color=red>Jack class becomes inaccessible from outside code.</font>

```javascript
<script src="./mylib.min.js"></script>
<script>
    const tom = new Tom();
    console.log(tom.sayHello());
</script>
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_2_4/client/example_for_browser.html" target="_blank">Open demo</a>


●Using from **Node.js**

```javascript
const Tom = require('./mylib.min.js');
const tom=new Tom();
console.log(tom.sayHello());//->Hi, I am Tom.
```

●Example of using **ES6's import** statement

```javascript
import Tom  from './mylib.min.js';
const tom=new Tom();
console.log(tom.sayHello());//->Hi, I am Tom.
```

●**Tips** for this recipe

The Jack class is included as code in the bundle even though it is not accessible from outside.
This is purely wasteful, so if your Jack class isn't used by anyone, don't put it in your source code.

## 3. Other options

### 3-1.Set a separate namespace for each module type.

When `libraryTarget: 'umd'` is specified
Root, AMD, and CommonJS can have different library names (namespaces).
However, you cannot specify a library name for CommonJS2 (for node.js) as before, it will be ignored.

#### Build Configuration

**webpack.config.js**

```javascript
entry: {
    'mylib': [`./src/family.js`],
},
output: {
    filename: `[name].min.js`,
    library: {
         root: 'GreatFamily',
         amd: 'great-family',
         commonjs: 'common-great-family',
    },
     libraryExport: '',
     libraryTarget: 'umd',
     globalObject: 'this',
     umdNamedDefine: true,
}
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_3_1/webpack.config.build-lib.js" target="_blank">See full source code of webpack.config.js</a>


```javascript
    library: {
         root: 'GreatFamily',
         amd: 'great-family',
         commonjs: 'common-great-family',
    },
```

In the above part,
the library name is given for each module type.

Be careful if you want to use the AMD module type.
Specify `umdNamedDefine: trueP` if you want to add library name to AMD.

Let's see the result of building with this setting.
The bundle is shown below.
As you can see, each module type has a specified library name.

**family.min.js**

```javascript
(function webpackUniversalModuleDefinition(root, factory) {
	//for CommonJS2 environment
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	//for AMD environment
	else if(typeof define === 'function' && define.amd)
		define("great-family", [], factory);
	//for CommonJS environment
	else if(typeof exports === 'object')
		exports["common-great-family"] = factory();
	//for Root
	else
		root["GreatFamily"] = factory();
})(this, function() {...}
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_3_1/mylib.develop.js" target="_blank">See full source code of bundle(develop build)</a>

### 3-2.Set a separate comment for each module type.

By writing **auxiliaryComment**, you can add comments to the source code of each module type definition of the generated code of bundle.

#### Build Configuration

**webpack.config.js**

```javascript
entry: {
    'mylib': [`./src/family.js`],
},
output: {
    filename: `[name].min.js`,
    library: {
         root: 'GreatFamily',
         amd: 'great-family',
         commonjs: 'common-great-family',
    },
    libraryExport: '',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true,
    auxiliaryComment: {
        root: 'Comment for Root',
        commonjs: 'Comment for CommonJS',
        commonjs2: 'Comment for CommonJS2',
        amd: 'Comment for AMD'
    }
}
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_3_2/webpack.config.build-lib.js" target="_blank">See full source code of webpack.config.js</a>


As you can see below,
you can see the comments in the bundle.

**family.min.js**

```javascript
(function webpackUniversalModuleDefinition(root, factory) {
	//Comment for CommonJS2
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	//Comment for AMD
	else if(typeof define === 'function' && define.amd)
		define("great-family", [], factory);
	//Comment for CommonJS
	else if(typeof exports === 'object')
		exports["common-great-family"] = factory();
	//Comment for Root
	else
		root["GreatFamily"] = factory();
})(this, function() {...}
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_3_2/mylib.develop.js" target="_blank">See full source code of bundle(develop build)</a>

## 3-3.Make library name looks like **namespace** separated by periods like "org.riversun.GereatFamily".

If you want to name the library "org.riversun.GreatFamily",
for example, specify an array like `library: ['org', 'riversun', 'GreatFamily']`


#### Build Configuration

**webpack.config.js**

```javascript
entry: {
    'mylib': [`./src/family.js`],
},
output: {
    filename: `[name].min.js`,
    library: ['org', 'riversun', 'GreatFamily'],
    libraryExport: '',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true,
},
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_3_3/webpack.config.build-lib.js" target="_blank">See full source code of webpack.config.js</a>


#### Source code of the **library**

**family.js**

```javascript
export class Tom {
    sayHello() {
        return 'Hi, I am Tom.'
    }
}
export class Jack {
    sayHello() {
        return 'Hi, I am Jack.'
    }
}
```


#### Source code for using this library


●Using from **Browser**

```javascript
<script src="./mylib.min.js"></script>
<script>
    const tom = new org.riversun.GreatFamily.Tom();
    const jack = new org.riversun.GreatFamily.Jack();
    console.log(tom.sayHello());
    console.log(jack.sayHello());
</script>
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_3_3/client/example_for_browser.html" target="_blank">Open demo</a>

As mentioned above, in case of node.js (CommonJS2), <font color=red>library name is ignored </font>.

          
### 3-4.Separate external libraries(dependencies) **using "externals"**

If your library uses an external library (if it has dependencies), there are two types of build methods.

- One method is to **bundle** an external library into your own library.
- The other method is to **externalize** an external library.

**This section describes "externalization" .**

![image.png](https://user-images.githubusercontent.com/11747460/75517817-f3a15780-5a42-11ea-915b-2812292786ba.png)



Here is an example of code where the **Tom** class depends on external library [**@riversun/simple-date-format**](https://www.npmjs.com/package/@riversun/simple-date-format).

**Install an external library

Install an external library to be used as development dependencies.

```shell
npm install --save-dev @riversun/simple-date-format
```          

#### Build Configuration

Add **externals** into **webpack.config.js** as below.

**webpack.config.js**

```javascript
entry: {
    'mylib': [`./src/family.js`],
},
output: {
    filename: `[name].min.js`,
    library: 'Tom',
    libraryExport: 'default',
    libraryTarget: 'umd',
    globalObject: 'this',

},
externals: {
    SDF: {
        commonjs: '@riversun/simple-date-format',
        commonjs2: '@riversun/simple-date-format',
        amd: '@riversun/simple-date-format',
        root: 'SimpleDateFormat'
    }
}
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_3_4/webpack.config.build-lib.js" target="_blank">See full source code of webpack.config.js</a>


In the following part, the part specified as "**SDF**" means the property name for referring to the external library from the source code.

```javascript

externals: {
    SDF: {
        commonjs: '@riversun/simple-date-format',
        commonjs2: '@riversun/simple-date-format',
        amd: '@riversun/simple-date-format',
        root: 'SimpleDateFormat'
    }
}
```

Write "**Library type name**:**Library name**" (same as `npm install`) as shown below in the child element of **SDF**.

```javascript
commonjs: '@riversun/simple-date-format',
commonjs2: '@riversun/simple-date-format',
amd: '@riversun/simple-date-format',
```
Library name can be set for each module type like **commonjs, commonjs2, amd**.
**SDF** in the example above acts as an alias. What the **SDF** actually points to is an external library specified for each module type.

Look at this at the bottom,

```javascript
root: 'SimpleDateFormat'
```

When using your own library on the browser, 
**SDF** is built to reference **SimpleDateFormat**(=window.["**SimpleDateFormat**"]).

● Generated bundle

When building, the following bundle is generated,

```javascript

(function webpackUniversalModuleDefinition(root, factory) {
	//for CommonJS2
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@riversun/simple-date-format"));
	//for AMD
	else if(typeof define === 'function' && define.amd)
		define("Tom", ["@riversun/simple-date-format"], factory);
	//for CommonJS
	else if(typeof exports === 'object')
		exports["Tom"] = factory(require("@riversun/simple-date-format"));
	//for Root
	else
		root["Tom"] = factory(root["SimpleDateFormat"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_SDF__) {...})
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_3_4/mylib.develop.js" target="_blank">See full source code of bundle(develop build)</a>

You can see that the code that loads the external library is generated for each module type.

This way you can avoid bundling external libraries.

Let's look at the source code of "my" library.

#### Source code of the **library**

**family.js**

```javascript
import SimpleDateFormat from "SDF";

export default class Tom {
    sayHello() {
        const date = new Date();
        const sdf = new SimpleDateFormat();
        return `Hi, I am Tom. Today is ${sdf.formatWith("EEE, MMM d, ''yy", date)}`;
    }
}
```

You can see that **SDF** in `import SimpleDateFormat from" SDF ";` is an alias of the original `import SimpleDateFormat from"@riversun/simple-date-format";`.

Next, let's look at using my library created by separating the external library.

#### Source code for using this library


●Using from **Browser**

- When using from a browser, read the external library from the CDN as follows
- Note that dependent libraries (external libraries) are loaded **"before"** my library.

```javascript
<script src="https://cdn.jsdelivr.net/npm/@riversun/simple-date-format@1.1.0/dist/simple-date-format.js"></script>
<script src="./mylib.min.js"></script>
<script>
    const tom = new Tom();
    document.write(tom.sayHello());
</script>
```

<a href="https://riversun.github.io/make-lib-with-webpack/part_3_4/client/example_for_browser.html" target="_blank">Open demo</a>

By the way, 
the external library used this time was also built by the method of 1-4 in this article.

●Using from **Node.js**

```javascript
const Tom = require('./mylib.min.js');
const tom = new Tom();
console.log(tom.sayHello());//-> Hi, I am Tom.
```

Written by Tom Misawa (riversun.org@gmail.com) on 2020-02-28