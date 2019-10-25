"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BindingResolutionException {
    constructor(message = '', name = '', stack = '') {
        this.message = message;
        this.name = name;
        this.stack = stack;
    }
}
exports.default = BindingResolutionException;
