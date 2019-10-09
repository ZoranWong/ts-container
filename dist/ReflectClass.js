"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("./Utils/Types");
const ReflectFunction_1 = require("./ReflectFunction");
class ReflectClass extends ReflectFunction_1.default {
    constructor($class) {
        super($class);
        this._className = null;
        this._className = this._callback.name;
    }
    paramParse() {
        return Types_1.ctorParamMetadata(this._callback);
    }
    getConstructor() {
        return this._callback;
    }
    isInstantiable() {
        return Types_1.isClass(this._callback);
    }
}
exports.default = ReflectClass;
