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
