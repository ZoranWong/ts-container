import Container from './Container';
import "reflect-metadata";
import Ctor from "./Contracts/Ctor";
import {isReallyInstanceOf} from "./Utils/Types";
import ConstructorInterface from "./Contracts/ConstructorInterface";
import IOCError from "./Expceptions/IOCError";


/**
 * 容器对象
 * @var
 * @type {Container} container
* */
const container = new Container();

/**
 * 注册前处理函数
 * @param {T} target 注册对象
 * @param {string} name 别名
 * @return {ConstructorInterface<T>}
* */
function beforeInject<T> (target: any, name: string = null): ConstructorInterface<T> {
    let _constructor: Ctor<T> = (target instanceof Function ? target : target.constructor);
    let _constructorStr = _constructor.toString();
    let paramTypes: Array<Function> = Reflect.getMetadata('design:paramtypes', _constructor);
    paramTypes = paramTypes ? paramTypes : [];
    if (name && container.bound(name)) {
        return;
    } else if (paramTypes.length > 0) {
        paramTypes.map((v: any, i) => {
            if (isReallyInstanceOf(_constructor, v)) {
                throw  new IOCError('不可以依赖自身');
            }
        })
    }
    return {_name: name, _constructorStr: _constructorStr, _constructor: _constructor, _paramTypes: paramTypes};
}

/**
 * 获取参数列表
 * @param {Array<Function>} paramTypes 参数列表类型数组
 * @return {Array<any>}
 * */
function getParamsInstances (paramTypes: Array<Function>): Array<any> {
    let paramInstances: Array<any> = paramTypes.map((v: Function, i) => {
        // 参数不可注入

        if (v instanceof Array) {
            return getParamsInstances(v as any);
            // 参数无依赖则直接创建对象
        } else {
            let param = factory(v);
            if(param){
                return param;
            }
            return new (v as any)();
        }
    });
    return paramInstances;
}

/**
 * 创建实例
 * @param {Array<Function>} paramTypes 参数类型数组
 * @param {{new (...args: Array<Function>): T}}
 * @return Function
 * */
function createInstance<T> (paramTypes: Array<Function>, _constructor: Ctor<T>, args: Array<any>) {
    let paramInstances: Array<any> = args.length > 0 ? args : getParamsInstances(paramTypes);
    return new _constructor(...paramInstances);
}

/**
 * 将class（target）注册到容器中
 * @param {String} name 别名默认没有
 * @return {ClassDecorator}
 * */
export function register (name: any = null): ClassDecorator {
    return (target: any) => {
        let {_name, _constructorStr, _constructor, _paramTypes} = beforeInject(target, name);
        if (!container.bound(_constructorStr))
            container.bind(_constructorStr, (container: Container, ...args: Array<any>) => {
                return createInstance(_paramTypes, _constructor, args);
            });
        if (_name) {
            container.alias(_constructorStr, _name);
        }
    }
}

/**
 * 为class（target）注册单例对象
 * @param {String} name 别名默认没有
 * @return {ClassDecorator}
 * */
export function singleton (name: string = null): ClassDecorator {
    return (target: any) => {
        let {_name, _constructorStr, _constructor, _paramTypes} = beforeInject(target, name);
        if (!container.bound(_constructorStr)){
            container.singleton(_constructorStr, (container: Container, ...args: Array<any>) => {
                return createInstance(_paramTypes, _constructor, args);
            });
        }

        if (_name) {
            container.alias(_constructorStr, _name);
        }

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
        return container.get(name.toString());
    }
    return name;
}
