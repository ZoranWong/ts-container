export default class ReflectionParameter {
    private _class = null;
    private _defaultValue = null;
    constructor(parameterClass, _defaultValue) {
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
