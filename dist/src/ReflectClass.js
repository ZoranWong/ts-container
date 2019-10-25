"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("./Utils/Types");
const ReflectFunction_1 = require("./ReflectFunction");
const _ = require("lodash");
class ReflectClass extends ReflectFunction_1.default {
    constructor($class) {
        super($class instanceof Function ? $class : (() => { $class; }));
        this._className = null;
        this._namespace = null;
        this._path = null;
        if (_.isString($class)) {
            let data = require($class);
            if (data) {
                this._callback = data['default'];
            }
        }
        let constructor = this._callback;
        this._namespace = constructor['namespace'];
        this._path = constructor['path'];
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
