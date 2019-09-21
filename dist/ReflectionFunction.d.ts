import { Closure } from './Utils/Types';
import ReflectionParameter from './ReflectionParameter';
export default class ReflectionFunction {
    protected _callback: Closure;
    protected _parameters: Array<ReflectionParameter<any>>;
    constructor(callback: Closure);
    getParameters(): any[];
    protected paramParse(): any[];
}
