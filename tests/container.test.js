import {register, singleton, factory, makeWith} from "../dist";
import {isClosure, isReallyInstanceOf, isTypeOf} from "../dist/Utils/Types";
@register('test', [Number])
class Test {
    constructor (a = 1){
        this.a = a;
    }
}

let test0 = makeWith('test', 2);
test('test: let test0 = makeWith(\'test\', 2); test0.a === 2: true', () => {
    expect(test0.a === 2).toBe(true);
});

@register
class Test1 {
    constructor (a = 1){
        this.a = a;
    }
}

let test1 = makeWith(Test, 2);
test('test: let test1 = makeWith(\'test\', 2); test1.a === 2: true', () => {
    expect(test1.a === 2).toBe(true);
});

let test2 = makeWith(Test, 'a');
test('test: let test2 = makeWith(\'test\', "a"); test2.a === "a": true', () => {
    expect(test2.a === "a").toBe(true);
});
