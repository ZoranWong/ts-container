"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AutoLoad_1 = require("../src/AutoLoad");
const src_1 = require("../src");
let data = AutoLoad_1.default.load(require.resolve("./Player"));
console.log(data);
console.log(src_1.factory("Test/Player"));
test('test auto load', () => {
    expect(1 == 1).toBe(true);
});
