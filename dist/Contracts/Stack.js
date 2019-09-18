"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const array_1 = require("../Utils/array");
class Stack {
    constructor() {
        this._size = 0;
    }
    push(value) {
        this._list.push(value);
        this._size++;
    }
    pop() {
        this._size--;
        return this._list.pop();
    }
    end() {
        return array_1.end(this._list);
    }
}
exports.default = Stack;
