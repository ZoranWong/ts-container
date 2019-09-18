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
    public static register(name: any, target: any = null) {
        if(!target) {
            target = name;
            name = null;
        }
        register(name)(target);
    }

    /**
     * 静态实例类型单例注册函数
     * @param {any} name 注册类型别名（或者注册类型 target = null时）
     * @param {any} target 注册类型
     * */
    public static singleton (name: any, target: any = null) {
        if(!target) {
            target = name;
            name = null;
        }
        singleton(name)(target);
    }
}
export  { register, singleton, factory, makeWith};
