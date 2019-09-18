"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReflectionFunction {
    constructor(callback) {
        this._callback = null;
        this._parameters = [];
        this._callback = callback;
    }
    getParameters() {
        return this._parameters;
    }
}
exports.default = ReflectionFunction;
