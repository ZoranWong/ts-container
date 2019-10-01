import { register, singleton, factory, makeWith } from "./IOC";
/**
 * 注册IOC单例入口
* */
export declare class IOC {
    version: String;
    constructor(version?: String);
    /**
     * 静态实例类型注册函数
     * @param {any} name 注册类型别名（或者注册类型 target = null时）
     * @param {any} target 注册类型
    * */
    register(name: any, target?: any, constructorParamTypes?: any[]): void;
    /**
     * 静态实例类型单例注册函数
     * @param {any} name 注册类型别名（或者注册类型 target = null时）
     * @param {any} target 注册类型
     * */
    singleton(name: any, target?: any, constructorParamTypes?: any[]): void;
}
declare const ioc: IOC;
export { register, singleton, factory, makeWith, ioc };
