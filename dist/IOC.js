"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("./Container");
require("reflect-metadata");
const ReflectClass_1 = require("./ReflectClass");
const md5 = require("md5");
const _ = require("lodash");
const Types_1 = require("./Utils/Types");
/**
 * 容器对象
 * @var
 * @type {Container} container
* */
exports.container = new Container_1.default();
/**
 * 注册前处理函数
 * @param {T} target 注册对象
 * @param {string} name 别名
 * @return {ConstructorInterface<T>}
* */
function beforeInject(target, name = null) {
    let _constructor = (target instanceof Function ? target : target.constructor);
    let _constructorStr = _constructor.toString();
    if (name && exports.container.bound(name)) {
        return;
    }
    return { _name: name, _constructorStr: md5(_constructorStr), _constructor: _constructor };
}
/**
 * 创建实例
 * @param {Ctor<T>} _constructor
 * @param {Array<any>} args
 * @return Function
 * */
function createInstance(_constructor, args) {
    let reflectClass = new ReflectClass_1.default(_constructor);
    let params = reflectClass.getParameters();
    let paramInstances = [];
    params.forEach((v, k) => {
        if (typeof args[k] !== 'undefined') {
            paramInstances.push(args[k]);
        }
        else {
            paramInstances.push(v);
        }
    });
    return new _constructor(...paramInstances);
}
/**
 * 将class（target）注册到容器中
 * @param {String} name 别名默认没有
 * @param {Array<any>} constructorParamTypes 注册类型的构造函数参数类型（js版本使用），默认为null
 * @return {any}
 * */
function register(name = null, constructorParamTypes = null) {
    let register = (target) => {
        if (!_.isString(name) && !Types_1.isClass(name) && _.isArray(name)) {
            constructorParamTypes = name;
            name = null;
        }
        if (constructorParamTypes) {
            Reflect.defineMetadata('design:paramtypes', constructorParamTypes, target);
        }
        let { _name, _constructorStr, _constructor } = beforeInject(target, name);
        if (!exports.container.bound(_constructorStr))
            exports.container.bind(_constructorStr, (container, ...args) => {
                return createInstance(_constructor, args);
            });
        if (_name) {
            exports.container.alias(_constructorStr, _name);
        }
    };
    if (!_.isString(name) && Types_1.isClass(name)) {
        register(name);
    }
    else {
        return register;
    }
}
exports.register = register;
/**
 * 为class（target）注册单例对象
 * @param {String|Ctor<T>} name 别名默认没有
 * @param {Array<any>} constructorParamTypes 注册类型的构造函数参数类型（js版本使用），默认为null
 * @return {any}
 * */
function singleton(name = null, constructorParamTypes = null) {
    let singleton = (target) => {
        if (!_.isString(name) && !Types_1.isClass(name) && _.isArray(name)) {
            constructorParamTypes = name;
            name = null;
        }
        if (constructorParamTypes) {
            Reflect.defineMetadata('design:paramtypes', constructorParamTypes, target);
        }
        let { _name, _constructorStr, _constructor } = beforeInject(target, name);
        if (!exports.container.bound(_constructorStr)) {
            exports.container.singleton(_constructorStr, (container, ...args) => {
                return createInstance(_constructor, args);
            });
        }
        if (_name) {
            exports.container.alias(_constructorStr, _name);
        }
    };
    if (!_.isString(name) && Types_1.isClass(name)) {
        singleton(name);
    }
    else {
        return singleton;
    }
}
exports.singleton = singleton;
/**
 * 工厂方法获取（创建）name对应的对象实例
 * @param {String| T} name 类型或者别名
 * @return T
* */
function factory(name) {
    if (name instanceof String || typeof name === 'string') {
        return exports.container.get(name);
    }
    else if (name instanceof Function) {
        return exports.container.get(md5(name.toString()));
    }
    return null;
}
exports.factory = factory;
/**
 * 工厂方法获取（创建）name对应的对象实例
 * @param {String| T} name 类型或者别名
 * @param {any[]} args 构造函数参数
 * @return T
 * */
function makeWith(name, ...args) {
    if (name instanceof String || typeof name === 'string') {
        return exports.container.makeWith(name, ...args);
    }
    else if (name instanceof Function) {
        return exports.container.makeWith(md5(name.toString()), ...args);
    }
    return null;
}
exports.makeWith = makeWith;
