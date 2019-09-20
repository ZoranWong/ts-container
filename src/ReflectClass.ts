import {ctorParamMetadata} from './Utils/Types';
import ReflectionParameter from './ReflectionParameter';
import IOCError from "./Expceptions/IOCError";
import ReflectionFunction from "./ReflectionFunction";
export default class ReflectionClass extends ReflectionFunction{
    protected _class: any = null;

    protected _className: string = null;

    constructor($class: any) {
        super($class);
        this._class = $class;
        this._className = $class.name;
        let params: Array<any> = ctorParamMetadata($class);
        let paramTypes: Array<Function> = Reflect.getMetadata('design:paramtypes', $class);

        params.forEach((value, index) => {
            let paramType = paramTypes[index];
            if(paramType === $class) {
                throw  new IOCError('不可以依赖自身');
            }
            let parameter = new ReflectionParameter<typeof paramType>(paramType, value['value'], value['name']);
            this._parameters.push(parameter);
        });
    }
}
