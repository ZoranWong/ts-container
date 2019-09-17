import ContainerContract from './Contracts/Container';
import {Closure, isTypeOf} from './Utils/Types';
import ContextualBindingBuilder from './ContextualBindingBuilder';
import * as _ from 'lodash';
import Binding from './Contracts/Binding';
import Stack from "./Contracts/Stack";
import {end} from "./Utils/array";
import TMap from "./TMap";

export default class Container implements ContainerContract {
    /**
     * The current globally available container (if any).
     *
     * @var static instance
     */
    protected static instance: any = null;

    /**
     * An array of the types that have been resolved.
     *
     * @var Map<string, any> _resolved
     */
    protected _resolved: TMap<any> = new TMap<any>();

    /**
     * The container's bindings.
     *
     * @var array
     */
    protected _bindings: TMap<Binding> = new TMap<Binding>();

    /**
     * The container's method bindings.
     *
     * @var array
     */
    protected _methodBindings: TMap<Closure> = new TMap<Closure>();

    /**
     * The container's shared instances.
     *
     * @var array
     */
    protected _instances: TMap<any> = new TMap<any>();

    /**
     * The registered type aliases.
     *
     * @var array
     */
    protected _aliases: TMap<any> = new TMap<any>();

    /**
     * The registered aliases keyed by the $abstract name.
     *
     * @var array
     */
    protected _$abstractAliases: TMap<Array<string>> = new TMap<Array<string>>();

    /**
     * The extension closures for services.
     *
     * @var array
     */
    protected _extenders: TMap<Array<any>> = new TMap<Array<any>>();

    /**
     * All of the registered tags.
     *
     * @var array
     */
    protected _tags: TMap<Array<any>> = new TMap<Array<any>>();

    /**
     * The stack of concretions currently being built.
     *
     * @var array
     */
    protected _buildStack: Stack = new Stack();

    /**
     * The parameter override stack.
     *
     * @var array
     */
    protected _with: any[] = [];

    /**
     * The contextual binding map.
     *
     * @var array
     */
    public _contextual: any[] = [];

    /**
     * All of the registered rebound callbacks.
     *
     * @var array
     */
    protected _reboundCallbacks: TMap<Array<Closure>> = new TMap<Array<Closure>>();

    /**
     * All of the global resolving callbacks.
     *
     * @var array
     */
    protected _globalResolvingCallbacks: Array<any> = [];

    /**
     * All of the global after resolving callbacks.
     *
     * @var array
     */
    protected _globalAfterResolvingCallbacks: Array<any> = [];

    /**
     * All of the resolving callbacks by class type.
     *
     * @var array
     */
    protected _resolvingCallbacks: Array<any> = [];

    /**
     * All of the after resolving callbacks by class type.
     *
     * @var array
     */
    protected _afterResolvingCallbacks: Array<any> = [];

    constructor () {

    }

    call (callback: any, parameters: any[], defaultMethod: string) {
        throw new Error("Method not implemented.");
    }

    public get (id: any): any {
        if (this.has(id)) {
            return this.resolve(id);
        }
        return null;
    }

    protected resolve ($abstract: string, parameters: Array<any> = []): any {
        $abstract = this.getAlias($abstract);

        let needsContextualBuild = (parameters.length > 0 || !_.isEmpty(
            this.getContextualConcrete($abstract)
        ));
        if (!_.isEmpty(this._instances.get($abstract)) && !needsContextualBuild) {
            return this._instances.get($abstract);
        }

        this._with.push(parameters);

        let concrete = this.getConcrete($abstract);

        let object: any = concrete();
        let extenders = this.getExtenders($abstract) ? this.getExtenders($abstract) : [];
        extenders.forEach(($extender: Closure) => {
            object = $extender(object, this);
        });

        if (this.isShared($abstract) && !needsContextualBuild) {
            this._instances.set($abstract, object);
        }

        this.fireResolvingCallbacks($abstract, object);

        this._resolved.set($abstract, true);
        this._with.pop();
        return object;
    }

    public addContextualBinding ($concrete: any, $abstract: any, $implementation: any): void {
        this._contextual[$concrete][this.getAlias($abstract)] = $implementation;
    }

    /**
     * Determine if the container has a method binding.
     *
     * @param  string  $method
     * @return boolean
     */
    public hasMethodBinding (method: string): boolean {
        return !_.isNull(this._methodBindings.get(method));
    }

    /**
     * Get the method binding for the given method.
     *
     * @param  string  method
     * @param  any  instance
     * @return any
     */
    public callMethodBinding (method: string, instance: any): any {
        return this._methodBindings.get(method).apply(instance, this);
    }

    /**
     * Fire all of the resolving callbacks.
     *
     * @param  string  $abstract
     * @param  any   object
     * @return void
     */
    protected fireResolvingCallbacks ($abstract: string, object: any) {
        this.fireCallbackArray(object, this._globalResolvingCallbacks);

        this.fireCallbackArray(
            object, this.getCallbacksForType($abstract, object, this._resolvingCallbacks)
        );

        this.fireAfterResolvingCallbacks($abstract, object);
    }

    protected fireAfterResolvingCallbacks ($abstract: string, object: any): any {
        this.fireCallbackArray(object, this._globalAfterResolvingCallbacks);

        this.fireCallbackArray(
            object, this.getCallbacksForType($abstract, object, this._afterResolvingCallbacks)
        );
    }

    protected getCallbacksForType ($abstract: string, object: any, callbacksForType: Array<any>): Array<any> {
        let results: any = [];
        callbacksForType.forEach((callbacks: any, type: any) => {
            if (type === $abstract || isTypeOf(object, type)) {
                results = results.concat(callbacks);
            }
        });
        return results;
    }

    protected fireCallbackArray (object: any, callbacks: Array<any>) {
        callbacks.forEach((callback: any) => {
            callback instanceof Function && (callback = [callback]);
            callback.forEach((fn: Closure) => {
                fn(object, this);
            });
        });
    }

    protected isShared ($abstract: string): boolean {
        let binding: Binding = this._bindings.get($abstract);
        return !_.isEmpty(this._instances.get($abstract)) && !_.isUndefined(this._instances.get($abstract))
            || (!_.isUndefined(binding) && !_.isEmpty(binding) && !_.isUndefined(binding.concrete)
                && binding.shared === true);
    }

    /**
     * Get the extender callbacks for a given type.
     *
     * @param  string  $$abstract
     * @return array
     */
    protected getExtenders ($abstract: string): Array<any> {
        $abstract = this.getAlias($abstract);
        if (!this._extenders.get($abstract)) {
            return this._extenders.get($abstract);
        }
        return [];
    }

    /**
     * Get the concrete type for a given $abstract.
     *
     * @param  {string}  $abstract
     * @return {any}   concrete
     */
    protected getConcrete ($abstract: string): any {
        let concrete = this.getContextualConcrete($abstract);
        if (!_.isUndefined(concrete) && !_.isNull(concrete)) {
            return concrete;
        }
        let binding = this._bindings.get($abstract);

        if (!_.isUndefined(binding) && !_.isNull(binding)) {
            return binding.concrete;
        }
        return $abstract;
    }

    /**
     * Get the contextual concrete binding for the given $abstract.
     *
     * @param  string  $abstract
     * @return string|null
     */
    protected getContextualConcrete ($abstract: string): any {
        let binding = this.findInContextualBindings($abstract);
        if (!_.isUndefined(binding) && !_.isNull(binding)) {
            return binding;
        }

        // Next we need to see if a contextual binding might be bound under an alias of the
        // given $abstract type. So, we will need to check if any aliases exist with this
        // type and then spin through them and check for contextual bindings on these.
        if (_.isEmpty(this._$abstractAliases.get($abstract))) {
            return null;
        }
        let $abstractAlias = this._$abstractAliases.get($abstract);
        $abstractAlias.forEach((alias) => {
            if (!_.isUndefined(binding = this.findInContextualBindings(alias)) && !_.isNull(binding)) {
                return binding;
            }
        });
    }

    /**
     * Find the concrete binding for the given $abstract in the contextual binding array.
     *
     * @param  string  $abstract
     * @return string|null
     */
    protected findInContextualBindings ($abstract: string): any {
        let end = this._buildStack.end();
        if (!_.isUndefined(this._contextual[end]) && !_.isArray(this._contextual[end]) && !_.isUndefined(this._contextual[end][$abstract])) {
            return this._contextual[end][$abstract];
        }
        return null;
    }

    public has (id: any): boolean {
        return this.bound(id);
    }

    /**
     * Determine if the given $abstract type has been bound.
     *
     * @param  {string}  $abstract
     * @return boolean
     */
    public bound ($abstract: string): boolean {
        return !_.isUndefined(this._bindings.get($abstract))
            || !_.isUndefined(this._instances.get($abstract))
            || this.isAlias($abstract);
    }

    public isAlias ($abstract: string): boolean {
        return !_.isUndefined(this._aliases.get($abstract));
    }

    /**
     * Alias a type to a different name.
     *
     * @param  string  $abstract
     * @param  string  alias
     * @return void
     */
    public alias ($abstract: string, alias: string) {
        this._aliases.set(alias, $abstract);
        let aliases = this._$abstractAliases.get($abstract);
        aliases = aliases ? aliases : [];
        aliases.push(alias);
        this._$abstractAliases.set($abstract, aliases);
    }

    /**
     * Get the alias for an $abstract if available.
     *
     * @param  string  $$abstract
     * @return string
     *
     * @throws \LogicException
     */
    public getAlias ($abstract: string): string {
        let _aliases = this._aliases.get($abstract);
        if (_.isUndefined(_aliases)) {
            return $abstract;
        }
        if (_aliases === $abstract) {
            throw `${$abstract} is aliased to itself.`;
        }
        return this.getAlias(_aliases);
    }

    /**
     * Assign a set of tags to a given binding.
     *
     * @param  array|string  $abstracts
     * @param  array|any   ...tags
     * @return void
     */
    public tag ($abstracts: any, ...tags: Array<any>) {
        tags.forEach((tag) => {
            if (_.isNull(this._tags.get(tag))) {
                this._tags.set(tag, []);
            }
            $abstracts = $abstracts as Array<any>;
            _.forEach($abstracts, ($abstract) => {
                this._tags.get(tag).push($abstract);
            });
        });
    }

    /**
     * Resolve all of the bindings for a given tag.
     *
     * @param  string  tag
     * @return array
     */
    public tagged (tag: string): Array<any> {
        let results: any[] = [];
        let tags = this._tags.get(tag);
        if (_.isEmpty(tags)) {
            tags.forEach(($abstract: any) => {
                results.push(this.make($abstract));
            });
        }
        return results;
    }

    /**
     * Register a binding with the container.
     *
     * @param  {string}  $abstract
     * @param  {Closure}  concrete
     * @param  {boolean}  shared
     * @return void
     */
    public bind ($abstract: string, concrete: Closure, shared: boolean = false) {
        concrete = this.getClosure(concrete);
        let compact: Binding = {"concrete": concrete, "shared": shared};
        this._bindings.set($abstract, compact);
        if (this.resolved($abstract)) {
            this.rebound($abstract);
        }
    }

    protected rebound ($abstract: any): any {
        let instance = this.make($abstract);
        let callbacks = this.getReboundCallbacks($abstract);
        callbacks.forEach((callback: Closure) => {
            callback(this, instance);
        });
    }

    /**
     * Get the rebound callbacks for a given type.
     *
     * @param  {string}  $abstract
     * @return {array}
     */
    protected getReboundCallbacks ($abstract: any): Array<any> {
        if (_.isNull(this._reboundCallbacks.get($abstract))) {
            return this._reboundCallbacks.get($abstract);
        }
        return [];
    }

    /**
     * Bind a new callback to an abstract's rebind event.
     *
     * @param  {string}    $abstract
     * @param  {Closure}  $callback
     * @return {any}
     */
    public rebinding ($abstract: any, $callback: Closure): any {
        $abstract = this.getAlias($abstract);
        let callbacks = this._reboundCallbacks.get($abstract);
        callbacks = callbacks ? callbacks : [];
        callbacks.push($callback);
        this._reboundCallbacks.set($abstract, callbacks);
        if (this.bound($abstract)) {
            return this.make($abstract);
        }
    }

    /**
     * Get the Closure to be used when building a type.
     * @param  {Closure}  $concrete
     * @return {Closure}
     */
    protected getClosure (concrete: Closure): Closure {
        return () => {
            let parameters: Array<any> = end(this._with);
            return concrete(this, ...parameters);
        };
    }

    public build (concrete: Closure): any {
        return concrete();
    }

    /**
     * Get the last parameter override.
     *
     * @return array
     */
    protected getLastParameterOverride (): Array<any> {
        return this._with.length > 0 ? end(this._with) : [];
    }

    protected dropStaleInstances ($abstract: string) {
        this._instances.delete($abstract);
        this._aliases.delete($abstract);
    }

    /**
     * Register a binding if it hasn't already been registered.
     *
     * @param  string  $abstract
     * @param  \Closure|string|null  concrete
     * @param  boolean  shared
     * @return void
     */
    public bindIf ($abstract: string, concrete: any = null, shared: boolean = false) {
        if (!this.bound($abstract)) {
            this.bind($abstract, concrete, shared);
        }
    }

    /**
     * Register a shared binding in the container.
     *
     * @param  string  $abstract
     * @param  Closure|string|null  concrete
     * @return void
     */
    public singleton ($abstract: string, concrete: any = null) {
        this.bind($abstract, concrete, true);
    }

    /**
     * "Extend" an $abstract type in the container.
     *
     * @param  string    $abstract
     * @param  Closure  closure
     * @return void
     *
     * @throws \InvalidArgumentException
     */
    public extend ($abstract: string, closure: Closure) {
        $abstract = this.getAlias($abstract);
        let instance = this._instances.get($abstract);
        if (!_.isNull(instance)) {
            let stack = new Array;
            stack.push(closure(instance, this));
            this._instances.set($abstract, stack);
            this.rebound($abstract);
        } else {
            this._extenders.get($abstract).push(closure);
            if (this.resolved($abstract)) {
                this.rebound($abstract);
            }
        }
    }

    /**
     * Register an existing instance as shared in the container.
     *
     * @param  string  $abstract
     * @param  any   instance
     * @return any
     */
    public instance ($abstract: string, instance: any): any {
        this.remove$abstractAlias($abstract);
        let isBound = this.bound($abstract);
        this._aliases.delete($abstract);

        this._instances.set($abstract, instance);
        if (isBound) {
            this.rebound($abstract);
        }
        return instance;
    }


    /**
     * Remove an alias from the contextual binding alias cache.
     *
     * @param  string  $searched
     * @return void
     */
    protected remove$abstractAlias (searched: string) {
        if (_.isEmpty(this._aliases.get(searched))) {
            return;
        }
        this._$abstractAliases.forEach((aliases, $abstract) => {
            aliases.forEach((alias, index) => {
                if (alias === searched) {
                    this._$abstractAliases.get($abstract).splice(index, 1);
                }
            });
        });
        throw new Error("Method not implemented.");
    }

    /**
     * Define a contextual binding.
     *
     * @param  string  $concrete
     * @return ContextualBindingBuilder
     */
    public when (concrete: string): ContextualBindingBuilder {
        return new ContextualBindingBuilder(this, this.getAlias(concrete));
    }

    /**
     * Get a closure to resolve the given type from the container.
     *
     * @param  string  $$abstract
     * @return \Closure
     */
    public factory ($abstract: string): Closure {
        return function () {
            return this.make($abstract);
        };
    }

    /**
     * An alias function name for make().
     *
     * @param  string  $$abstract
     * @param  array  $parameters
     * @return any
     */
    public makeWith ($abstract: string, parameters: any[] = []): any {
        return this.make($abstract, parameters);
    }

    /**
     * Resolve the given type from the container.
     *
     * @param  string  $abstract
     * @param  Array<any>  parameters
     * @return any
     */
    public make ($abstract: string, parameters: Array<any> = []): any {
        return this.resolve($abstract, parameters);
    }

    /**
     * Call the given Closure / class@method and inject its dependencies.
     *
     * @param  callable|string  callback
     * @param  array  parameters
     * @param  string|null  defaultMethod
     * @return mixed
     */
    public all (callback: any, parameters: Array<any>, defaultMethod: string) {

    }

    /**
     * Determine if the given $abstract type has been resolved.
     *
     * @param  string $abstract
     * @return boolean
     */
    public resolved ($abstract: any): boolean {
        if (this.isAlias($abstract)) {
            $abstract = this.getAlias($abstract);
        }
        return _.isNull(this._resolved.get($abstract))
            || _.isNull(this._instances.get($abstract));
    }

    /**
     * Register a new resolving callback.
     *
     * @param  \Closure|string  $abstract
     * @param  \Closure|null  callback
     * @return void
     */
    public resolving ($abstract: any, callback: any = null) {
        if (_.isString($abstract)) {
            $abstract = this.getAlias($abstract);
        }

        if (_.isNull(callback) && _.isFunction($abstract)) {
            this._globalResolvingCallbacks.push($abstract);
        } else {
            let callbacks: Array<Closure> = this._resolvingCallbacks[$abstract] ?
                this._resolvingCallbacks[$abstract] : (this._resolvingCallbacks[$abstract] = []);
            callbacks.push(callback);
        }
    }

    /**
     * Register a new after resolving callback.
     *
     * @param  \Closure|string  $abstract
     * @param  \Closure|null  callback
     * @return void
     */
    public afterResolving ($abstract: any, callback: any) {
        if (_.isString($abstract)) {
            $abstract = this.getAlias($abstract);
        }
        if (_.isFunction($abstract) && _.isNull(callback)) {
            this._globalAfterResolvingCallbacks.push($abstract);
        } else {
            this._afterResolvingCallbacks[$abstract].push(callback);
        }
    }
}
