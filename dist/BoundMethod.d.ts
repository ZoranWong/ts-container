import Container from './Container';
import { Closure } from './Utils/Types';
export default class BoundMethod {
    /**
     * Call the given Closure / class@method and inject its dependencies.
     *
     * @param  Container  container
     * @param  callable|string  $callback
     * @param  array  $parameters
     * @param  string|null  $defaultMethod
     * @return mixed
     */
    static call(container: Container, callback: Closure, parameters?: Array<any>, defaultMethod?: any): any;
    /**
     * Call a string reference to a class using Class@method syntax.
     *
     * @param  Container  container
     * @param  string  target
     * @param  array parameters
     * @param  string|null  defaultMethod
     * @return mixed
     *
     * @throws \InvalidArgumentException
     */
    protected static callClass(container: Container, target: any, parameters?: Array<any>, defaultMethod?: any): void;
    /**
     * Call a method that has been bound to the container.
     *
     * @param  Container  container
     * @param  callable  defaultCallback
     * @param  any  default
     * @return mixed
     */
    protected static callBoundMethod(container: Container, callback: Closure, defaultCallback: any): any;
    /**
     * Normalize the given callback into a Class@method string.
     *
     * @param  callable  $callback
     * @return string
     */
    protected static normalizeMethod(callback: any): any;
    /**
     * Get all dependencies for a given method.
     *
     * @param  Container  $container
     * @param  callable|string  $callback
     * @param  array  $parameters
     * @return array
     */
    protected static getMethodDependencies(container: Container, callback: any, parameters?: Array<any>): void;
    /**
     * Get the proper reflection instance for the given callback.
     *
     * @param  callable|string  $callback
     * @return \ReflectionFunctionAbstract
     */
    protected static getCallReflector(callback: any): void;
    /**
     * Get the dependency for the given call parameter.
     *
     * @param  Container  $container
     * @param  Reflect  $parameter
     * @param  array  $parameters
     * @param  array  $dependencies
     * @return mixed
     */
    protected static addDependencyForCallParameter(container: Container, parameter: any, parameters: Array<any>, dependencies: Array<any>): void;
    /**
     * Determine if the given string is in Class@method syntax.
     *
     * @param  any  callback
     * @return bool
     */
    protected static isCallableWithAtSign(callback: any): boolean;
}
