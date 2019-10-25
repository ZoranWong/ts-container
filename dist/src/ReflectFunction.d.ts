import { Closure } from './Utils/Types';
import ReflectParameter from './ReflectParameter';
export default class ReflectFunction {
    protected _callback: Closure;
    protected _parameters: Array<ReflectParameter<any>>;
    constructor(callback: Closure);
    getParameters(): any[];
    protected paramParse(): any[];
}
