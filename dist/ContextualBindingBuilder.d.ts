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
     * @param  \Illuminate\Container\Container  $container
     * @param  string  $concrete
     * @return void
     */
    constructor(container: Container, concrete: string);
    /**
     * Define the abstract target that depends on the context.
     *
     * @param  string  $abstract
     * @return $this
     */
    needs(abstract: any): this;
    /**
     * Define the implementation for the contextual binding.
     *
     * @param  \Closure|string  implementation
     * @return void
     */
    give(implementation: any): void;
}
