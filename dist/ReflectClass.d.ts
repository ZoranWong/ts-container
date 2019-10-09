import ReflectFunction from "./ReflectFunction";
import Ctor from "./Contracts/Ctor";
export default class ReflectClass extends ReflectFunction {
    protected _className: string;
    constructor($class: any);
    protected paramParse(): any[];
    getConstructor(): Ctor<any>;
    isInstantiable(): boolean;
}
