"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const IOC_1 = require("./IOC");
exports.register = IOC_1.register;
exports.singleton = IOC_1.singleton;
exports.factory = IOC_1.factory;
exports.makeWith = IOC_1.makeWith;
/**
 * 注册IOC单例入口
* */
let IOC = class IOC {
    constructor(version = "0.0.1") {
        this.version = version;
    }
    /**
     * 静态实例类型注册函数
     * @param {any} name 注册类型别名（或者注册类型 target = null时）
     * @param {any} target 注册类型
    * */
    static register(name, target = null) {
        if (!target) {
            target = name;
            name = null;
        }
        IOC_1.register(name)(target);
    }
    /**
     * 静态实例类型单例注册函数
     * @param {any} name 注册类型别名（或者注册类型 target = null时）
     * @param {any} target 注册类型
     * */
    static singleton(name, target = null) {
        if (!target) {
            target = name;
            name = null;
        }
        IOC_1.singleton(name)(target);
    }
};
IOC = __decorate([
    IOC_1.singleton('IOC'),
    __metadata("design:paramtypes", [String])
], IOC);
exports.IOC = IOC;
