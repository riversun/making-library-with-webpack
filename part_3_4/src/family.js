// (3-4) library source code
import SimpleDateFormat from "SDF";

export default class Tom {
    sayHello() {
        const date = new Date();
        const sdf = new SimpleDateFormat();
        return `Hi, I am Tom. Today is ${sdf.formatWith("EEE, MMM d, ''yy", date)}`;
    }
}