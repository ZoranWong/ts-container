import { Closure } from './Utils/Types';
import ReflectionParameter from './ReflectionParameter';
export default class ReflectionFunction {
    private _callback;
    private _parameters;
    constructor(callback: Closure);
    getParameters(): ReflectionParameter<any>[];
}
