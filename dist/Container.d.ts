import ContainerContract from './Contracts/Container';
import { Closure } from './Utils/Types';
import ContextualBindingBuilder from './ContextualBindingBuilder';
import Binding from './Contracts/Binding';
import Stack from "./Contracts/Stack";
import TMap from "./TMap";
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
    protected _resolved: TMap<any>;
    /**
     * The container's bindings.
     *
     * @var array
     */
    protected _bindings: TMap<Binding>;
    /**
     * The container's method bindings.
     *
     * @var array
     */
    protected _methodBindings: TMap<Closure>;
    /**
     * The container's shared instances.
     *
     * @var array
     */
    protected _instances: TMap<any>;
    /**
     * The registered type aliases.
     *
     * @var array
     */
    protected _aliases: TMap<any>;
    /**
     * The registered aliases keyed by the $abstract name.
     *
     * @var array
     */
    protected _$abstractAliases: TMap<Array<string>>;
    /**
     * The extension closures for services.
     *
     * @var array
     */
    protected _extenders: TMap<Array<any>>;
    /**
     * All of the registered tags.
     *
     * @var array
     */
    protected _tags: TMap<Array<any>>;
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
    protected _reboundCallbacks: TMap<Array<Closure>>;
    /**
     * All of the global resolving callbacks.
     *
     * @var array
     */
    protected _globalResolvingCallbacks: Array<any>;
    /**
     * All of the global after resolving callbacks.
     *
     * @var array
     */
    protected _globalAfterResolvingCallbacks: Array<any>;
    /**
     * All of the resolving callbacks by class type.
     *
     * @var array
     */
    protected _resolvingCallbacks: Array<any>;
    /**
     * All of the after resolving callbacks by class type.
     *
     * @var array
     */
    protected _afterResolvingCallbacks: Array<any>;
    constructor();
    get(id: any): any;
    protected resolve($abstract: any, parameters?: Array<any>): any;
    addContextualBinding($concrete: any, $abstract: any, $implementation: any): void;
    /**
     * Determine if the container has a method binding.
     *
     * @param  string  $method
     * @return boolean
     */
    hasMethodBinding(method: string): boolean;
    /**
     * Get the method binding for the given method.
     *
     * @param  string  method
     * @param  any  instance
     * @return any
     */
    callMethodBinding(method: string, instance: any): any;
    /**
     * Fire all of the resolving callbacks.
     *
     * @param  string  $abstract
     * @param  any   object
     * @return void
     */
    protected fireResolvingCallbacks($abstract: string, object: any): void;
    protected fireAfterResolvingCallbacks($abstract: string, object: any): any;
    protected getCallbacksForType($abstract: string, object: any, callbacksForType: Array<any>): Array<any>;
    protected fireCallbackArray(object: any, callbacks: Array<any>): void;
    protected isShared($abstract: string): boolean;
    /**
     * Get the extender callbacks for a given type.
     *
     * @param  string  $$abstract
     * @return array
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
     * @param  string  $abstract
     * @return string|null
     */
    protected getContextualConcrete($abstract: string): any;
    /**
     * Find the concrete binding for the given $abstract in the contextual binding array.
     *
     * @param  string  $abstract
     * @return string|null
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
     * @param  string  $abstract
     * @param  string  alias
     * @return void
     */
    alias($abstract: string, alias: string): void;
    /**
     * Get the alias for an $abstract if available.
     *
     * @param  string  $$abstract
     * @return string
     *
     * @throws \LogicException
     */
    getAlias($abstract: string): string;
    /**
     * Assign a set of tags to a given binding.
     *
     * @param  array|string  $abstracts
     * @param  array|any   ...tags
     * @return void
     */
    tag($abstracts: any, ...tags: Array<any>): void;
    /**
     * Resolve all of the bindings for a given tag.
     *
     * @param  string  tag
     * @return array
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
    protected getClosure(concrete: Closure): Closure;
    build(concrete: Closure): any;
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
     * @param  string  $abstract
     * @param  \Closure|string|null  concrete
     * @param  boolean  shared
     * @return void
     */
    bindIf($abstract: string, concrete?: any, shared?: boolean): void;
    /**
     * Register a shared binding in the container.
     *
     * @param  string  $abstract
     * @param  Closure|string|null  concrete
     * @return void
     */
    singleton($abstract: string, concrete?: any): void;
    /**
     * "Extend" an $abstract type in the container.
     *
     * @param  string    $abstract
     * @param  Closure  closure
     * @return void
     *
     * @throws \InvalidArgumentException
     */
    extend($abstract: string, closure: Closure): void;
    /**
     * Register an existing instance as shared in the container.
     *
     * @param  string  $abstract
     * @param  any   instance
     * @return any
     */
    instance($abstract: string, instance: any): any;
    /**
     * Remove an alias from the contextual binding alias cache.
     *
     * @param  string  $searched
     * @return void
     */
    protected remove$abstractAlias(searched: string): void;
    /**
     * Define a contextual binding.
     *
     * @param  string  $concrete
     * @return ContextualBindingBuilder
     */
    when(concrete: string): ContextualBindingBuilder;
    /**
     * Get a closure to resolve the given type from the container.
     *
     * @param  string  $$abstract
     * @return \Closure
     */
    factory($abstract: string): Closure;
    /**
     * An alias function name for make().
     *
     * @param  string  $$abstract
     * @param  array  $parameters
     * @return any
     */
    makeWith($abstract: String, parameters?: any[]): any;
    /**
     * Resolve the given type from the container.
     *
     * @param  string  $abstract
     * @param  Array<any>  parameters
     * @return any
     */
    make($abstract: String, parameters?: Array<any>): any;
    /**
     * Call the given Closure / class@method and inject its dependencies.
     *
     * @param  callable|string  callback
     * @param  array  parameters
     * @param  string|null  defaultMethod
     * @return mixed
     */
    all(callback: any, parameters: Array<any>, defaultMethod: string): void;
    /**
     * Determine if the given $abstract type has been resolved.
     *
     * @param  string $abstract
     * @return boolean
     */
    resolved($abstract: any): boolean;
    /**
     * Register a new resolving callback.
     *
     * @param  \Closure|string  $abstract
     * @param  \Closure|null  callback
     * @return void
     */
    resolving($abstract: any, callback?: any): void;
    /**
     * Register a new after resolving callback.
     *
     * @param  \Closure|string  $abstract
     * @param  \Closure|null  callback
     * @return void
     */
    afterResolving($abstract: any, callback: any): void;
}
