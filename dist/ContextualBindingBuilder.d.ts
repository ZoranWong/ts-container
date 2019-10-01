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
    constructor(container: Container, concrete: string);
    /**
     * Define the abstract target that depends on the context.
     *
     * @return $this
     * @param abstract
     */
    needs(abstract: any): this;
    /**
     * Define the implementation for the contextual binding.
     *
     * @return void
     * @param implementation
     */
    give(implementation: any): void;
}
