import Ctor from "./Ctor";
/**
 * 构造函数接口拓展
 * */
export default interface ConstructorInterface<T> {
    _name: string;
    _constructor: Ctor<T>;
}
