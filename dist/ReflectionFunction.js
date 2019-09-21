"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReflectionParameter_1 = require("./ReflectionParameter");
const IOCError_1 = require("./Expceptions/IOCError");
class ReflectionFunction {
    constructor(callback) {
        this._callback = null;
        this._parameters = [];
        this._callback = callback;
        let params = this.paramParse();
        let paramTypes = Reflect.getMetadata('design:paramtypes', this._callback);
        params.forEach((value, index) => {
            let paramType = paramTypes[index];
            if (paramType === this._callback) {
                throw new IOCError_1.default('不可以依赖自身');
            }
            let parameter = new ReflectionParameter_1.default(paramType, value['value'], value['name']);
            this._parameters.push(parameter);
        });
    }
    getParameters() {
        return this._parameters.map((param) => {
            return param.getValue();
        });
    }
    paramParse() {
        return [];
    }
}
exports.default = ReflectionFunction;
