import { Closure } from './Utils/Types';
import ReflectionParameter from './ReflectionParameter';
export default class ReflectionFunction {
    private _callback: Closure = null;

    private _parameters: Array<ReflectionParameter<any>> = [];

    constructor(callback: Closure) {
        this._callback = callback;
    }

    public getParameters() {
        return this._parameters;
    }
}
