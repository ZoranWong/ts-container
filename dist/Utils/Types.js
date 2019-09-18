"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isTypeOf(obj, $class) {
    if (obj.constructor.toString() === $class || obj.constructor.toString().includes($class)) {
        return true;
    }
    else {
        return false;
    }
}
exports.isTypeOf = isTypeOf;
/**
 * instanceof 操作拓展
 * */
function isReallyInstanceOf(ctor, obj) {
    return obj instanceof ctor;
}
exports.isReallyInstanceOf = isReallyInstanceOf;
/**
 * 是否回调函数（严格模式下类型定义必须使用class语法糖）
 * @param {any} closure
 * @return {boolean}
 * */
function isClosure(closure) {
    return closure instanceof Function && !closure.toString().includes('class ');
}
exports.isClosure = isClosure;
function ctorParamMetadata(fn) {
    let str = fn.toString();
    let match = str.match(/constructor\(\s*([^\)]*)\)/m);
    if (!match) {
        return [];
    }
    str = match ? match[1] : '';
    str = str.replace(/(\/\*[\s\S]*?\*\/)/mg, '');
    let params = str.split(',');
    let parameters = [];
    params.reduce(function (p, param) {
        param = param.match(/([_$a-zA-Z][^=]*)(?:=([^=]+))?/);
        let paramName = param[1].trim();
        let paramDefaultVal = eval(param[2]);
        parameters.push({ name: paramName, value: paramDefaultVal });
        return parameters;
    }, {});
    return parameters;
}
exports.ctorParamMetadata = ctorParamMetadata;
