import { Closure } from './Utils/Types';
import ReflectFunction from "./ReflectFunction";
import Ctor from "./Contracts/Ctor";
export default class ReflectClass extends ReflectFunction {
    protected _className: string;
    protected _namespace: string;
    protected _path: string;
    constructor($class: Closure | string);
    protected paramParse(): any[];
    getConstructor(): Ctor<any>;
    isInstantiable(): boolean;
}
