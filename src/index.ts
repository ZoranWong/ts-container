"use strict";
import {register, singleton, factory, makeWith} from "./IOC";

/**
 * 注册IOC单例入口
* */
@singleton('IOC')
export class IOC {
    constructor(public version: String = "0.0.1"){}
    /**
     * 静态实例类型注册函数
     * @param {any} name 注册类型别名（或者注册类型 target = null时）
     * @param {any} target 注册类型
    * */
    public  register(name: any, target: any = null, constructorParamTypes: any[] = null) {
        if(!target) {
            target = name;
            name = null;
        }
        register(name, constructorParamTypes)(target);
    }

    /**
     * 静态实例类型单例注册函数
     * @param {any} name 注册类型别名（或者注册类型 target = null时）
     * @param {any} target 注册类型
     * */
    public  singleton (name: any, target: any = null, constructorParamTypes: any[] = null) {
        if(!target) {
            target = name;
            name = null;
        }
        singleton(name, constructorParamTypes)(target);
    }
}
const ioc: IOC = factory(IOC);
export  { register, singleton, factory, makeWith, ioc};
