"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("./Utils/Types");
class AutoLoad {
    static load(path) {
        let requires = require(path);
        for (let requiresKey in requires) {
            if (Types_1.isClass(requires[requiresKey])) {
                requires[requiresKey].path = path;
            }
        }
        return requires;
    }
}
exports.default = AutoLoad;
