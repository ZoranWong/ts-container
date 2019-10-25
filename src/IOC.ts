"use strict";
import Container from './Container';
import "reflect-metadata";
import Ctor from "./Contracts/Ctor";
import ConstructorInterface from "./Contracts/ConstructorInterface";
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
    if (name && container.bound(name)) {
        return;
    }
    return {_name: name, _constructor: _constructor};
}

export function namespace (namespace: string) {
    return (tagert: any) => {
        tagert.namespace = _.trim(namespace,"/") + '/' + tagert.name;
    }
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
        let {_name, _constructor} = beforeInject(target, name);
        if (!container.bound(target.namespace)) {
            container.bind(target.namespace, _constructor);
        }
        if (_name) {
            container.alias(target.namespace, _name);
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
        let {_name, _constructor} = beforeInject(target, name);
        if (!container.bound(target.namespace)){
            container.singleton(target.namespace, _constructor);
        }
        if (_name) {
            container.alias(target.namespace, _name);
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
    return container.get(name);
}

/**
 * 工厂方法获取（创建）name对应的对象实例
 * @param {String| T} name 类型或者别名
 * @param {any[]} args 构造函数参数
 * @return T
 * */
export function makeWith<T> (name: any, ...args: any[]): T {
    return container.makeWith(name, args);
}
