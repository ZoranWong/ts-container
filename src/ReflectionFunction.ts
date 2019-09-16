import { Closure } from './Utils/Types';
import ReflectionParameter from './ReflectionParameter';
export default class ReflectionFunction {
    private _callback: Closure = null;

    private _parameters: Array<ReflectionParameter> = [];

    constructor(callback: Closure) {
        this._callback = callback;
    }

    public getParameters() {
        throw new Error("Not implemented yet");
    }
}
