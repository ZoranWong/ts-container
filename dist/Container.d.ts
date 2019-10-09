import ContainerContract from './Contracts/Container';
import { Closure } from './Utils/Types';
import ContextualBindingBuilder from './ContextualBindingBuilder';
import Binding from './Contracts/Binding';
import Stack from "./Contracts/Stack";
import StrKeyMap from "./StrKeyMap";
export default class Container implements ContainerContract {
    /**
     * The current globally available container (if any).
     *
     * @var static instance
     */
    protected static instance: any;
    /**
     * An array of the types that have been resolved.
     *
     * @var Map<string, any> _resolved
     */
    protected _resolved: StrKeyMap<any>;
    /**
     * The container's bindings.
     *
     * @var array
     */
    protected _bindings: StrKeyMap<Binding>;
    /**
     * The container's method bindings.
     *
     * @var array
     */
    protected _methodBindings: StrKeyMap<Closure>;
    /**
     * The container's shared instances.
     *
     * @var array
     */
    protected _instances: StrKeyMap<any>;
    /**
     * The registered type aliases.
     *
     * @var array
     */
    protected _aliases: StrKeyMap<any>;
    /**
     * The registered aliases keyed by the $abstract name.
     *
     * @var array
     */
    protected _$abstractAliases: StrKeyMap<Array<string>>;
    /**
     * The extension closures for services.
     *
     * @var array
     */
    protected _extenders: StrKeyMap<Array<any>>;
    /**
     * All of the registered tags.
     *
     * @var array
     */
    protected _tags: StrKeyMap<Array<any>>;
    /**
     * The stack of concretions currently being built.
     *
     * @var array
     */
    protected _buildStack: Stack;
    /**
     * The parameter override stack.
     *
     * @var array
     */
    protected _with: any[];
    /**
     * The contextual binding map.
     *
     * @var array
     */
    _contextual: any[];
    /**
     * All of the registered rebound callbacks.
     *
     * @var array
     */
    protected _reboundCallbacks: StrKeyMap<Array<Closure>>;
    /**
     * All of the global resolving callbacks.
     *
     * @var array
     */
    protected _globalResolvingCallbacks: StrKeyMap<any>;
    /**
     * All of the global after resolving callbacks.
     *
     * @var array
     */
    protected _globalAfterResolvingCallbacks: StrKeyMap<any>;
    /**
     * All of the resolving callbacks by class type.
     *
     * @var array
     */
    protected _resolvingCallbacks: StrKeyMap<any>;
    /**
     * All of the after resolving callbacks by class type.
     *
     * @var array
     */
    protected _afterResolvingCallbacks: StrKeyMap<any>;
    constructor();
    get(id: any): any;
    protected resolve($abstract: any, parameters?: Array<any>, raiseEvents?: boolean): any;
    protected isBuildable($concrete: any, $abstract: any): boolean;
    /**
     * add contextual binding
     * @return void
     * @param $concrete
     * @param $abstract
     * @param $implementation
     * */
    addContextualBinding($concrete: any, $abstract: any, $implementation: any): void;
    /**
     * Determine if the container has a method binding.
     *
     * @return boolean
     * @param method
     */
    hasMethodBinding(method: string): boolean;
    /**
     * Get the method binding for the given method.
     *
     * @return any
     * @param method
     * @param instance
     */
    callMethodBinding(method: string, instance: any): any;
    /**
     * Fire all of the resolving callbacks.
     *
     * @return void
     * @param $abstract
     * @param object
     */
    protected fireResolvingCallbacks($abstract: string, object: any): void;
    protected fireAfterResolvingCallbacks($abstract: string, object: any): any;
    protected getCallbacksForType($abstract: string, object: any, callbacksForType: StrKeyMap<any>): Array<any>;
    protected fireCallbackArray(object: any, callbacks: Array<any> | StrKeyMap<any>): void;
    protected isShared($abstract: string): boolean;
    /**
     * Get the extender callbacks for a given type.
     *
     * @return array
     * @param $abstract
     */
    protected getExtenders($abstract: string): Array<any>;
    /**
     * Get the concrete type for a given $abstract.
     *
     * @param  {string}  $abstract
     * @return {any}   concrete
     */
    protected getConcrete($abstract: string): any;
    /**
     * Get the contextual concrete binding for the given $abstract.
     *
     * @return string|null
     * @param $abstract
     */
    protected getContextualConcrete($abstract: string): any;
    /**
     * Find the concrete binding for the given $abstract in the contextual binding array.
     *
     * @return string|null
     * @param $abstract
     */
    protected findInContextualBindings($abstract: string): any;
    has(id: any): boolean;
    /**
     * Determine if the given $abstract type has been bound.
     *
     * @param  {string}  $abstract
     * @return boolean
     */
    bound($abstract: string): boolean;
    isAlias($abstract: string): boolean;
    /**
     * Alias a type to a different name.
     *
     * @return void
     * @param $abstract
     * @param alias
     */
    alias($abstract: string, alias: string): void;
    /**
     * Get the alias for an $abstract if available.
     *
     * @return string
     *
     * @throws \LogicException
     * @param $abstract
     */
    getAlias($abstract: string): string;
    /**
     * Assign a set of tags to a given binding.
     *
     * @return void
     * @param $abstracts
     * @param tags
     */
    tag($abstracts: any, ...tags: Array<any>): void;
    /**
     * Resolve all of the bindings for a given tag.
     *
     * @return array
     * @param tag
     */
    tagged(tag: string): Array<any>;
    /**
     * Register a binding with the container.
     *
     * @param  {string}  $abstract
     * @param  {Closure}  concrete
     * @param  {boolean}  shared
     * @return void
     */
    bind($abstract: string, concrete: Closure, shared?: boolean): void;
    protected rebound($abstract: any): any;
    /**
     * Get the rebound callbacks for a given type.
     *
     * @param  {string}  $abstract
     * @return {array}
     */
    protected getReboundCallbacks($abstract: any): Array<any>;
    /**
     * Bind a new callback to an abstract's rebind event.
     *
     * @param  {string}    $abstract
     * @param  {Closure}  $callback
     * @return {any}
     */
    rebinding($abstract: any, $callback: Closure): any;
    /**
     * Get the Closure to be used when building a type.
     * @param  {Closure}  $concrete
     * @return {Closure}
     */
    protected getClosure(concrete: any): Closure;
    /**
     * 创建实例
     * @param {Ctor<T>} _constructor
     * @param {Array<any>} args
     * @return Function
     * */
    protected createInstance(_constructor: any, args: Array<any>): any;
    build(concrete: any): any;
    /**
     * @param concrete
     * @throws
     * */
    protected notInstantiable(concrete: any): void;
    /**
     * Get the last parameter override.
     *
     * @return array
     */
    protected getLastParameterOverride(): Array<any>;
    protected dropStaleInstances($abstract: string): void;
    /**
     * Register a binding if it hasn't already been registered.
     *
     * @return void
     * @param $abstract
     * @param concrete
     * @param shared
     */
    bindIf($abstract: string, concrete?: any, shared?: boolean): void;
    /**
     * Register a shared binding in the container.
     *
     * @return void
     * @param $abstract
     * @param concrete
     */
    singleton($abstract: string, concrete?: any): void;
    /**
     * "Extend" an $abstract type in the container.
     *
     * @return void
     *
     * @throws \InvalidArgumentException
     * @param $abstract
     * @param closure
     */
    extend($abstract: string, closure: Closure): void;
    /**
     * Register an existing instance as shared in the container.
     *
     * @return any
     * @param $abstract
     * @param instance
     */
    instance($abstract: string, instance: any): any;
    /**
     * Remove an alias from the contextual binding alias cache.
     *
     * @return void
     * @param searched
     */
    protected removeAbstractAlias(searched: string): void;
    /**
     * Define a contextual binding.
     *
     * @return ContextualBindingBuilder
     * @param concrete
     */
    when(concrete: string): ContextualBindingBuilder;
    /**
     * Get a closure to resolve the given type from the container.
     *
     * @return \Closure
     * @param $abstract
     */
    factory($abstract: string): Closure;
    /**
     * An alias function name for make().
     *
     * @return any
     * @param $abstract
     * @param parameters
     */
    makeWith($abstract: String, parameters?: any[]): any;
    /**
     * Resolve the given type from the container.
     *
     * @return any
     * @param $abstract
     * @param parameters
     */
    make($abstract: String, parameters?: Array<any>): any;
    /**
     * Call the given Closure / class@method and inject its dependencies.
     *
     * @return mixed
     * @param callback
     * @param parameters
     * @param defaultMethod
     */
    all(callback: any, parameters: Array<any>, defaultMethod: string): void;
    /**
     * Determine if the given $abstract type has been resolved.
     *
     * @return boolean
     * @param $abstract
     */
    resolved($abstract: any): boolean;
    /**
     * Register a new resolving callback.
     *
     * @return void
     * @param $abstract
     * @param callback
     */
    resolving($abstract: any, callback?: any): void;
    /**
     * Register a new after resolving callback.
     *
     * @return void
     * @param $abstract
     * @param callback
     */
    afterResolving($abstract: any, callback: any): void;
}
