import ContainerInterface from './ContainerInterface';
import { Closure } from '../Utils/Types';
export default interface Container extends ContainerInterface {
    /**
     * Determine if the given abstract type has been bound.
     *
     * @param  string  abstract
     * @return bool
     */
    bound(abstract: string): boolean;

    /**
     * Alias a type to a different name.
     *
     * @param  string  abstract
     * @param  string  alias
     * @return void
     */
    alias(abstract: string, alias: string): void;

    /**
     * Assign a set of tags to a given binding.
     *
     * @param  array|string  abstracts
     * @param  array|any   ...tags
     * @return void
     */
    tag(abstracts: any, ...tags: Array<any>): void;

    /**
     * Resolve all of the bindings for a given tag.
     *
     * @param  string  tag
     * @return array
     */
    tagged(tag: string): any;

    /**
     * Register a binding with the container.
     *
     * @param  string  abstract
     * @param  \Closure|string|null  concrete
     * @param  boolean  shared
     * @return void
     */
    bind(abstract: string, concrete: any, shared: boolean): void;

    /**
     * Register a binding if it hasn't already been registered.
     *
     * @param  string  abstract
     * @param  \Closure|string|null  concrete
     * @param  boolean  shared
     * @return void
     */
    bindIf(abstract: string, concrete: any, shared: boolean): void;

    /**
     * Register a shared binding in the container.
     *
     * @param  string  abstract
     * @param  \Closure|string|null  concrete
     * @return void
     */
    singleton(abstract: string, concrete: any): void;

    /**
     * "Extend" an abstract type in the container.
     *
     * @param  string    abstract
     * @param  \Closure  closure
     * @return void
     *
     * @throws \InvalidArgumentException
     */
    extend(abstract: string, closure: Closure): void;

    /**
     * Register an existing instance as shared in the container.
     *
     * @param  string  abstract
     * @param  any   instance
     * @return mixed
     */
    instance(abstract: string, instance: any): void;

    /**
     * Define a contextual binding.
     *
     * @param  string  $concrete
     * @return \Illuminate\Contracts\Container\ContextualBindingBuilder
     */
    when(concrete: string): void;

    /**
     * Get a closure to resolve the given type from the container.
     *
     * @param  string  $abstract
     * @return \Closure
     */
    factory(abstract: string): void;

    /**
     * Resolve the given type from the container.
     *
     * @param  string  abstract
     * @param  Array<any>  parameters
     * @return mixed
     */
    make(abstract: string, parameters: Array<any>): void;

    /**
     * Call the given Closure / class@method and inject its dependencies.
     *
     * @param  callable|string  callback
     * @param  array  parameters
     * @param  string|null  defaultMethod
     * @return mixed
     */
    call(callback: any, parameters: Array<any>, defaultMethod: string): void;

    /**
     * Determine if the given abstract type has been resolved.
     *
     * @param  string abstract
     * @return bool
     */
    resolved(abstract: string): void;

    /**
     * Register a new resolving callback.
     *
     * @param  \Closure|string  abstract
     * @param  \Closure|null  callback
     * @return void
     */
    resolving(abstract: any, callback: any): void;

    /**
     * Register a new after resolving callback.
     *
     * @param  \Closure|string  abstract
     * @param  \Closure|null  callback
     * @return void
     */
    afterResolving(abstract: any, callback: any): void;
}
