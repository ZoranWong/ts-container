import Ctor from "./Contracts/Ctor";
export default class ReflectionParameter<T> {
    private _class: Ctor<T> = null;
    private _defaultValue: T = null;
    constructor(parameterClass: any, _defaultValue: T) {
        this._class = parameterClass;
        this._defaultValue = _defaultValue;
    }

    public getClass() {
        return this._class;
    }

    public getClassName() {
        return (<any>this).constructor.name;
    }

    public getDefaultValue() {
        return this._defaultValue;
    }

    public isDefaultValueAvailable() {
        return !!this._defaultValue;
    }
}
