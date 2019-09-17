import Ctor from "../Contracts/Ctor";

export type Closure = Function;

export function  isTypeOf(obj: any, $class: string) {
    if (obj.constructor.toString() === $class || obj.constructor.toString().includes($class)) {
        return true;
    }else{
        return false;
    }
}

/**
 * instanceof 操作拓展
 * */
export function isReallyInstanceOf<T> (ctor: any, obj: T) {
    return obj instanceof ctor;
}

/**
 * 是否回调函数（严格模式下类型定义必须使用class语法糖）
 * @param {any} closure
 * @return {boolean}
* */
export function isClosure (closure: any) {
    return closure instanceof Function && !closure.toString().includes('class ');
}
