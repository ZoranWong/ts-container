import ReflectionFunction from "./ReflectionFunction";
export default class ReflectionClass extends ReflectionFunction {
    protected _className: string;
    constructor($class: any);
    protected paramParse(): any[];
}
