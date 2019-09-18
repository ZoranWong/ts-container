import {ctorParamMetadata, isReallyInstanceOf} from './Utils/Types';
import ReflectionParameter from './ReflectionParameter';
import IOCError from "./Expceptions/IOCError";
export default class ReflectionClass {
    private _class: any = null;

    private _className: string = null;

    private _parameters: Array<ReflectionParameter<any>> = [];

    constructor($class: any) {
        this._class = $class;
        this._className = $class.name;
        let params: Array<any> = ctorParamMetadata($class);
        let paramTypes: Array<Function> = Reflect.getMetadata('design:paramtypes', $class);
        params.forEach((value, index) => {
            let paramType = paramTypes[index];
            if(isReallyInstanceOf(paramType, $class)) {
                throw  new IOCError('不可以依赖自身');
            }
            let parameter = new ReflectionParameter<typeof paramType>(paramType, value['value'], value['name']);
            this._parameters.push(parameter);
        });
    }

    public getParameters() {
        return this._parameters.map((param: ReflectionParameter<any>) => {
            return param.getValue();
        });
    }
}
