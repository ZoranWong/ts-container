"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IOC_1 = require("./IOC");
const _ = require("lodash");
/**
* @class
* @classdesc 函数参数映射
* */
class ReflectParameter {
    constructor(parameterClass, _defaultValue, name) {
        this._class = null;
        this._defaultValue = null;
        this._name = null;
        this._class = parameterClass;
        this._defaultValue = _defaultValue;
        this._name = name;
    }
    getClass() {
        return this._class;
    }
    getClassName() {
        return this.getClass() ? this.getClass().name : null;
    }
    getDefaultValue() {
        return this._defaultValue;
    }
    getValue() {
        return this.isDefaultValueAvailable() ? this.getDefaultValue() :
            (this.getClassName() && this.getClassName() !== 'Object' ? this.getParamInstance(this.getClass()) : null);
    }
    /**
     * 获取参数列表
     * @param {Array<Function>} param 参数列表类型数组
     * @return {any}
     * */
    getParamInstance(param) {
        if (_.isArray(param)) {
            return param.map((v) => {
                // 参数不可注入
                if (v instanceof Array) {
                    return this.getParamInstance(v);
                    // 参数无依赖则直接创建对象
                }
                else {
                    let param = IOC_1.factory(v);
                    if (param) {
                        return param;
                    }
                    return new v();
                }
            });
        }
        else {
            let instance = IOC_1.factory(param);
            if (instance) {
                return instance;
            }
            return new (param)();
        }
    }
    isDefaultValueAvailable() {
        return this._defaultValue !== undefined;
    }
}
exports.default = ReflectParameter;
