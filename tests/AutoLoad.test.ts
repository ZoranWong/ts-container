import AutoLoad from "../src/AutoLoad";
import {factory} from "../src";

type F = (k:string,fn: Function )=> void ;
type E = (p: boolean) => any ;
declare var test: F ;
declare var expect: E;

let data = AutoLoad.load(require.resolve("./Player"));

console.log(data);

console.log(factory("Test/Player"));

test('test auto load', () => {
    expect(1 == 1).toBe(true);
});
