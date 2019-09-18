import Ctor from "../Contracts/Ctor";

export type Closure = Function;

export function isTypeOf (obj: any, $class: string) {
    if (obj.constructor.toString() === $class || obj.constructor.toString().includes($class)) {
        return true;
    } else {
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

export function ctorParamMetadata<T> (fn: any) {
    let str: String = fn.toString();
    let match = str.match(/constructor\(\s*([^\)]*)\)/m);
    if(!match) {
        return [];
    }
    str = match ? match[1] : '';
    str = str.replace(/(\/\*[\s\S]*?\*\/)/mg, '');
    let params: string[] = str.split(',');
    let parameters: any[] = [];
    params.reduce(function (p: any, param: any): any {
        param = param.match(/([_$a-zA-Z][^=]*)(?:=([^=]+))?/);
        let paramName = param[1].trim();
        let paramDefaultVal = eval(param[2]);
        parameters.push({name: paramName, value: paramDefaultVal});
        return parameters;
    }, {});
    return parameters;
}
