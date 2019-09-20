"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("./Utils/Types");
const ReflectionFunction_1 = require("./ReflectionFunction");
class ReflectionClass extends ReflectionFunction_1.default {
    constructor($class) {
        super($class);
        this._className = null;
        this._className = this._callback.name;
    }
    paramParse() {
        return Types_1.ctorParamMetadata(this._callback);
    }
}
exports.default = ReflectionClass;
