"use strict";
/**
 * 构造函数接口
 * * */
export default interface Ctor<T>{new (...args: Array<Function>): T}
