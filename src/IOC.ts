"use strict";
import Container from './Container';
import "reflect-metadata";
import Ctor from "./Contracts/Ctor";
import ConstructorInterface from "./Contracts/ConstructorInterface";
import ReflectClass from "./ReflectClass";
import * as md5 from "md5";
import * as _ from "lodash";
import {isClass} from "./Utils/Types";


/**
 * 容器对象
 * @var
 * @type {Container} container
* */
export const container = new Container();

/**
 * 注册前处理函数
 * @param {T} target 注册对象
 * @param {string} name 别名
 * @return {ConstructorInterface<T>}
* */
function beforeInject<T> (target: any, name: string = null): ConstructorInterface<T> {
    let _constructor: Ctor<T> = (target instanceof Function ? target : target.constructor);
    let _constructorStr = _constructor.toString();
    if (name && container.bound(name)) {
        return;
    }
    return {_name: name, _constructorStr: md5(_constructorStr), _constructor: _constructor};
}

/**
 * 创建实例
 * @param {Ctor<T>} _constructor
 * @param {Array<any>} args
 * @return Function
 * */
function createInstance<T> (_constructor: Ctor<T>, args: Array<any>) {
    let reflectClass = new ReflectClass(_constructor);
    let params = reflectClass.getParameters();
    let paramInstances: Array<any> = [];
    params.forEach((v, k) => {
        if(typeof args[k] !== 'undefined') {
            paramInstances.push(args[k]);
        }else{
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
export function register (name: any = null, constructorParamTypes: Array<any> = null): any {
    let register =  (target: any) => {
        if(!_.isString(name) && !isClass(name) && _.isArray(name)) {
            constructorParamTypes = name;
            name = null;
        }
        if(constructorParamTypes) {
            Reflect.defineMetadata('design:paramtypes', constructorParamTypes, target);
        }
        let {_name, _constructorStr, _constructor} = beforeInject(target, name);
        if (!container.bound(_constructorStr))
            container.bind(_constructorStr, (container: Container, ...args: Array<any>) => {
                return createInstance( _constructor, args);
            });
        if (_name) {
            container.alias(_constructorStr, _name);
        }
    }
    if(!_.isString(name) && isClass(name)) {
        register(name);
    }else{
        return register;
    }
}

/**
 * 为class（target）注册单例对象
 * @param {String|Ctor<T>} name 别名默认没有
 * @param {Array<any>} constructorParamTypes 注册类型的构造函数参数类型（js版本使用），默认为null
 * @return {any}
 * */
export function singleton (name: any = null, constructorParamTypes: Array<any> = null): any {
    let singleton =  (target: any) => {
        if(!_.isString(name) && !isClass(name) && _.isArray(name)) {
            constructorParamTypes = name;
            name = null;
        }
        if(constructorParamTypes) {
            Reflect.defineMetadata('design:paramtypes', constructorParamTypes, target);
        }
        let {_name, _constructorStr, _constructor} = beforeInject(target, name);
        if (!container.bound(_constructorStr)){
            container.singleton(_constructorStr, (container: Container, ...args: Array<any>) => {
                return createInstance( _constructor, args);
            });
        }

        if (_name) {
            container.alias(_constructorStr, _name);
        }
    }

    if(!_.isString(name) && isClass(name)) {
        singleton(name);
    }else{
        return singleton;
    }
}

/**
 * 工厂方法获取（创建）name对应的对象实例
 * @param {String| T} name 类型或者别名
 * @return T
* */
export function factory<T> (name: any): T {
    if (name instanceof String || typeof name === 'string') {
        return container.get(name);
    } else if (name instanceof Function) {
        return container.get(md5(name.toString()));
    }
    return null;
}

/**
 * 工厂方法获取（创建）name对应的对象实例
 * @param {String| T} name 类型或者别名
 * @param {any[]} args 构造函数参数
 * @return T
 * */
export function makeWith<T> (name: any, ...args: any[]): T {
    if (name instanceof String || typeof name === 'string') {
        return container.makeWith(name, args);
    } else if (name instanceof Function) {
        return container.makeWith(md5(name.toString()), args);
    }
    return null;
}
