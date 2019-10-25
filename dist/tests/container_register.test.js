"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const Types_1 = require("../src/Utils/Types");
const IOC_1 = require("../src/IOC");
let OtherService = class OtherService {
    constructor(a = 1) {
        this.a = a;
    }
};
OtherService = __decorate([
    src_1.singleton,
    __metadata("design:paramtypes", [Number])
], OtherService);
let TestService = class TestService {
    constructor(otherService) {
        this.otherService = otherService;
    }
};
TestService = __decorate([
    src_1.register('test'),
    __metadata("design:paramtypes", [OtherService])
], TestService);
test('register: factory(\'test\') === factory(\'test\') : false', () => {
    expect(src_1.factory('test') === src_1.factory('test')).toBe(false);
});
test('singleton: factory(OtherService) === factory(OtherService): true', () => {
    expect(src_1.factory(OtherService) === src_1.factory(OtherService)).toBe(true);
});
test('singleton: factory(OtherService) === factory("test").otherService: true', () => {
    expect(src_1.factory(OtherService) === src_1.factory('test').otherService).toBe(true);
});
test('isTypeOf: class name: true', () => {
    expect(Types_1.isTypeOf(src_1.factory('test'), TestService.name)).toBe(true);
});
test('isTypeOf: constructor to string: true', () => {
    expect(Types_1.isTypeOf(src_1.factory('test'), TestService.toString())).toBe(true);
});
test('isReallyInstanceOf: TestService: true', () => {
    expect(Types_1.isReallyInstanceOf(TestService, src_1.factory('test'))).toBe(true);
});
test('isClosure: TestService: false', () => {
    expect(Types_1.isClosure(TestService)).toBe(false);
});
test('isClosure: () => {}: true', () => {
    expect(Types_1.isClosure(() => { })).toBe(true);
});
let T1 = class T1 {
    constructor(a = 1) {
        this.a = a;
    }
};
T1 = __decorate([
    src_1.register('test1'),
    __metadata("design:paramtypes", [Number])
], T1);
test('makeWith: makeWith(\'test1\', 3).a === 3: true', () => {
    expect(src_1.makeWith('test1', 3).a === 3).toBe(true);
});
test('makeWith: makeWith(\'test\', new OtherService).otherService === factory(OtherService): false', () => {
    expect(src_1.makeWith('test', new OtherService()).otherService === src_1.factory(OtherService)).toBe(false);
});
let T2 = class T2 {
    constructor(a = 'test') {
        this.a = a;
    }
};
T2 = __decorate([
    src_1.register('t2'),
    __metadata("design:paramtypes", [String])
], T2);
test('makeWith: makeWith(\'t2\', "test class T2").a === "test": false', () => {
    expect(src_1.makeWith('t2', "test class T2").a === "test").toBe(false);
});
test('factory: factory(\'t2\').a === "test": true', () => {
    expect(src_1.factory('t2').a === "test").toBe(true);
});
let T3 = class T3 {
    constructor(a = 'test') {
        this.a = a;
    }
};
T3 = __decorate([
    src_1.register,
    __metadata("design:paramtypes", [String])
], T3);
test('factory: factory(T3).a === "test": true', () => {
    console.log(src_1.factory(T3));
    expect(src_1.factory(T3).a === "test").toBe(true);
});
let TestResolve = class TestResolve {
};
TestResolve = __decorate([
    src_1.register('testResolving')
], TestResolve);
IOC_1.container.resolving('testResolving', function (t3, container) {
    console.log(container.has('t1'), '------------------------------');
});
IOC_1.container.afterResolving('testResolving', function () {
    console.log('------------- after --------------');
});
IOC_1.container.when('testResolving').needs(T3).give(new T3());
console.log(src_1.factory('testResolving'));
// console.log(factory('./Player'));
IOC_1.container.bind('App/Test', () => {
    console.log('App/Test');
    return 'App/Test';
});
//
console.log(IOC_1.container.get('App/Test'));
setTimeout(function () {
    console.log('--------------- set time out ----------');
    console.log(src_1.factory('player'));
}, 1000);
test('async ', () => __awaiter(void 0, void 0, void 0, function* () {
    let res = yield (() => __awaiter(void 0, void 0, void 0, function* () { return 1; }))();
    const Player = require('./Player').default;
    console.log(res, new Player);
    console.log(require(require.resolve('./Player')));
    expect(1 == 1).toBe(true);
}));
console.log(require.resolve(''));
