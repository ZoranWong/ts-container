"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("./Utils/Types");
const ReflectParameter_1 = require("./ReflectParameter");
const IOCError_1 = require("./Expceptions/IOCError");
class ReflectFunction {
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
            let parameter = new ReflectParameter_1.default(paramType, value['value'], value['name']);
            this._parameters.push(parameter);
        });
    }
    getParameters() {
        return this._parameters.map((param) => {
            return param.getValue();
        });
    }
    paramParse() {
        return Types_1.ctorParamMetadata(this._callback);
    }
}
exports.default = ReflectFunction;
