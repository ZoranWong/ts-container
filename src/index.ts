import {isReallyInstanceOf, register, singleton, factory} from "./IOC";
/**
 * 注册IOC单例入口
* */
@singleton('IOC')
class IOC {
    version: String = '0.0.1';
    public static register(name: any, target: any = null) {
        if(!target) {
            target = name;
            name = null;
        }
        register(name)(target);
    }

    public static singleton (name: any, target: any = null) {
        if(!target) {
            target = name;
            name = null;
        }
        singleton(name)(target);
    }
}

export default {isReallyInstanceOf, register, singleton, factory, IOC};
