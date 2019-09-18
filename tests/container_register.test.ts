import {register, singleton, factory, makeWith} from "../src/IOC";
import {isClosure, isReallyInstanceOf, isTypeOf} from "../src/Utils/Types";
declare var test: Function;
declare var expect: Function;
@singleton()
class OtherService {
    constructor (public a: number = 1 ) {
    }
}

@register('test')
class TestService {
    constructor(public readonly otherService: OtherService) {}
}
test('register: factory(\'test\') === factory(\'test\') : false', () => {
    expect(factory('test') === factory('test')).toBe(false);
});

test('singleton: factory(OtherService) === factory(OtherService): true', () => {
    expect(factory(OtherService) === factory(OtherService)).toBe(true);
});

test('singleton: factory(OtherService) === factory("test").otherService: true', () => {
    expect(factory(OtherService) === (factory('test') as TestService).otherService).toBe(true);
});

test('isTypeOf: class name: true', () => {
    expect(isTypeOf(factory('test'), TestService.name)).toBe(true);
});

test('isTypeOf: constructor to string: true', () => {
    expect(isTypeOf(factory('test'), TestService.toString())).toBe(true);
});

test('isReallyInstanceOf: TestService: true', () => {
    expect(isReallyInstanceOf<TestService>(TestService, factory('test'))).toBe(true);
});

test('isClosure: TestService: false', () => {
    expect(isClosure(TestService)).toBe(false);
});

test('isClosure: () => {}: true', () => {
    expect(isClosure(() => {})).toBe(true);
});

@register('test1')
class T1 {
    constructor(public readonly a: Number = 1){}
}
test('makeWith: makeWith(\'test1\', 3).a === 3: true', () => {
    expect((makeWith('test1', 3) as T1).a === 3).toBe(true);
});

test('makeWith: makeWith(\'test\', new OtherService).otherService === factory(OtherService): false', () => {
    expect((makeWith('test', new OtherService()) as TestService).otherService === factory(OtherService)).toBe(false);
});
