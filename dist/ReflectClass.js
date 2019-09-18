"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("./Utils/Types");
const ReflectionParameter_1 = require("./ReflectionParameter");
const IOCError_1 = require("./Expceptions/IOCError");
class ReflectionClass {
    constructor($class) {
        this._class = null;
        this._className = null;
        this._parameters = [];
        this._class = $class;
        this._className = $class.name;
        let params = Types_1.ctorParamMetadata($class);
        let paramTypes = Reflect.getMetadata('design:paramtypes', $class);
        params.forEach((value, index) => {
            let paramType = paramTypes[index];
            if (Types_1.isReallyInstanceOf(paramType, $class)) {
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
}
exports.default = ReflectionClass;
