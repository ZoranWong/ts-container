import {register, factory, makeWith} from "../src";
import * as os from "os";
type F = (k:string,fn: Function )=> void ;
type E = (p: boolean) => any ;
declare var test: F ;
declare var expect: E;
@register
class T1 {
    constructor(public a: String = 'a', public b: Number = 3){}
}
// let {heapUsed, heapTotal} = process.memoryUsage();
// console.log('----- free1 memory ---', free1);
let t1: T1 = factory(T1);
 let {heapUsed, heapTotal} = process.memoryUsage();
console.log('----- free2 memory ---', heapUsed / heapTotal,  t1);
var t2: any = null;
// let t3: any[] = [];
let i = 0;
setInterval(() => {
    // console.log(t1, t2, t3);
    t2 = null;
    // gc();
    t2 = makeWith(T1, 'No.' + i, i);
    let {heapUsed, heapTotal} = process.memoryUsage();
    console.log('----- free3 memory ---', heapUsed / heapTotal, t2);
    i ++;
}, 500)

// test('free mem', function () {
//     expect(free1 !== free3).toBe(true);
// });