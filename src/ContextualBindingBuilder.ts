"use strict";
import ContextualBindingBuilderContract from './Contracts/ContextualBindingBuilder';
import Container from './Container';
export default class ContextualBindingBuilder implements ContextualBindingBuilderContract {
    /**
     * The underlying container instance.
     *
     * @var Container
     */
    protected container: Container;

    /**
     * The concrete instance.
     *
     * @var string
     */
    protected concrete: any;

    /**
     * The abstract target.
     *
     * @var string
     */
    protected need: any;

    /**
     * Create a new contextual binding builder.
     *
     * @return void
     * @param container
     * @param concrete
     */
    constructor(container: Container, concrete: string) {
        this.concrete = concrete;
        this.container = container;
    }

    /**
     * Define the abstract target that depends on the context.
     *
     * @return $this
     * @param abstract
     */
    public needs(abstract: any) {
        this.need = abstract;
        return this;
    }

    /**
     * Define the implementation for the contextual binding.
     *
     * @return void
     * @param implementation
     */
    public give(implementation: any) {
        this.container.addContextualBinding(
            this.concrete, this.need, implementation
        );
    }
}
