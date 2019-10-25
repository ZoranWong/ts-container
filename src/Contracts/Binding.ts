"use strict";
import Ctor from "./Ctor";
import ContainerInterface from "./ContainerInterface";
import {Closure} from "../Utils/Types";

export default interface Binding {
    shared: any,
    concrete: Ctor<any> | ((container: ContainerInterface, value?: any) => unknown)|string|Closure
}
