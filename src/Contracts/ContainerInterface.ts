"use strict";
export default interface ContainerInterface {
    /**
    * Finds an entry of the container by its identifier and returns it.
    *
    * @param string id Identifier of the entry to look for.
    *
    * @throws NotFoundExceptionInterface  No entry was found for **this** identifier.
    * @throws ContainerExceptionInterface Error while retrieving the entry.
    *
    * @return any Entry.
    */
    get(id: any): any;

    /**
    * Returns true if the container can return an entry for the given identifier.
    * Returns false otherwise.
    *
    * `has($id)` returning true does not mean that `get($id)` will not throw an exception.
    * It does however mean that `get($id)` will not throw a `NotFoundExceptionInterface`.
    *
    * @param string id Identifier of the entry to look for.
    *
    * @return bool
    */
    has(id: any): boolean;
}
