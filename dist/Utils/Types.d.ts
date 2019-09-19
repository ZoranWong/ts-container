export declare type Closure = Function;
export declare function isTypeOf(obj: any, $class: string): boolean;
/**
 * instanceof 操作拓展
 * */
export declare function isReallyInstanceOf<T>(ctor: any, obj: T): boolean;
/**
 * 是否回调函数（严格模式下类型定义必须使用class语法糖）
 * @param {any} closure
 * @return {boolean}
 * */
export declare function isClosure(closure: any): boolean;
export declare function isClass($class: any): any;
export declare function ctorParamMetadata<T>(fn: any): any[];
