import {register, factory, makeWith} from "../src";
import * as os from "os";
type F = (k:string,fn: Function )=> void ;
type E = (p: boolean) => any ;
declare var test: F ;
declare var expect: E;
@register
class T1 {
    constructor(public a: String = 'a', public b: any){}
}
// let {heapUsed, heapTotal} = process.memoryUsage();
// console.log('----- free1 memory ---', free1);
let t1: T1 = factory(T1);
console.log(t1);
var t2: any = null;
var res: any = null;

function outer() {
    var largeData = new Array(10000000);
    var oldRes = res;

    /* Unused but leaks? */
    function inner() {
        if (oldRes) return largeData;
    }

    return function(){return oldRes;};
}

// setInterval(function() {
//     res = outer();
//     let {heapUsed, heapTotal} = process.memoryUsage();
//     console.log('----- free3 memory ---', heapUsed / heapTotal, t2);
// }, 10);

// test('free mem', function () {
//     expect(free1 !== free3).toBe(true);
// });


