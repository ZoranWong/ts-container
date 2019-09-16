import Container from './Container';
import "reflect-metadata";
import IOCError from "./Expceptions/IOCError";

const container = new Container();

function isReallyInstanceOf<T> (ctor: { new (...args: any[]): T }, obj: T) {
    return obj instanceof ctor;
}

interface ConstructorInterface<T> {
    _name: string,
    _constructorStr: string,
    _constructor: { new (...args: Array<any>): T },
    _paramTypes: Array<Function>
}

function beforeInject<T> (target: any, name: string = null): ConstructorInterface<T> {
    let _constructor: { new (...args: Array<Function>): T } = (target instanceof Function ? target : target.constructor);
    let _constructorStr = _constructor.toString();
    let paramTypes: Array<Function> = Reflect.getMetadata('design:paramtypes', _constructor);
    if (name && container.bound(name)) {
        return;
    } else if (paramTypes.length > 0) {
        paramTypes.map((v: any, i) => {
            if (isReallyInstanceOf(_constructor, v)) {
                throw  new IOCError('不可以依赖自身');
            } else if (!container.bound(v)) {
                throw new IOCError(`依赖${i}[${(v as any).name}]不可被注入`);
            }
        })
    }
    return {_name: name, _constructorStr: _constructorStr, _constructor: _constructor, _paramTypes: paramTypes};
}

function getParamsInstances (paramTypes: Array<Function>): Array<any> {
    let paramInstances: Array<any> = paramTypes.map((v, i) => {
        // 参数不可注入
        if (!container.bound(v)) {
            throw new Error(`参数${i}[${(v as any).name}]不可被注入`);
            // 参数有依赖项则递归实例化参数对象
        } else if (v.length) {
            return getParamsInstances(v as any);
            // 参数无依赖则直接创建对象
        } else {
            return new (v as any)();
        }
    });
    return paramInstances;
}

function createInstance<T> (paramTypes: Array<Function>, _constructor: { new (...args: Array<Function>): T }, args: Array<any>) {
    let paramInstances: Array<any> = args.length > 0 ? args : getParamsInstances(paramTypes);
    return new _constructor(...paramInstances);
}

export function register (name: string = null): Function {
    return (target: any) => {
        let {_name, _constructorStr, _constructor, _paramTypes} = beforeInject(target, name);
        if (!container.bound(_constructorStr))
            container.bind(_constructorStr, (...args: Array<any>) => {
                return createInstance(_paramTypes, _constructor, args);
            });
        if (_name)
            container.alias(_name, _constructorStr);
    }
}

export function singleton (name: string = null): Function {
    return (target: any) => {
        let {_name, _constructorStr, _constructor, _paramTypes} = beforeInject(target, name);
        if (container.bound(_constructorStr))
            container.singleton(_constructorStr, (...args: Array<any>) => {
                return createInstance(_paramTypes, _constructor, args);
            });
        if (_name)
            container.alias(_name, _constructorStr);
    }
}

export function factory<T> (name: String | T): T {
    if (name instanceof String) {
        return container.get(name);
    } else if (name instanceof Function) {
        return container.get(name.toString());
    }
    return name;
}
