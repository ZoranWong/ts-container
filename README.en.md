## [Chinese](/README.en.md)
## [pretty-ts-container](https://www.npmjs.com/package/pretty-ts-container) is a container which can makes classes and objects to be organized and managed easier, and which provides a decorator-style IOC for programming.And also all classes finally will be registered into a global object (which is a Container type constant.).
##### Install
- npm install pretty-ts-container --save
- npm i pretty-ts-container --save
##### API Introduction
###### Typescript
- register(alias: string = null) It will register a class to the container.
- singleton(alias: string = null) It will register a singleton for a class
- factory(alias: string|T) Creating a object by a alias or a class which has been registered into the container.  
- makeWith(alias: string|T, ... args: any[]) Creating a object by a alias or a class which has been registered into the container which you can pass some parameters to the class's constructor function. 

````typescript
import {register, singleton, makeWith, factory} from "pretty-ts-container";
@register // @register() same
 class T1 {
   constructor ( public a: number = 0){}
 }
 @singleton // @singleton() same
  class T2 {
    constructor ( public a: number = 0){}
  }
// register Test，test will be can to a alias for Test
@register('test')
 class Test {
   constructor ( public a: number = 0){}
 }
 // register Test1
 @register()
 class Test1 {
   constructor(public b: number){}
 }
// register a singleton for Test2，test3 will be can to a alias for Test2
 @singleton('test3')
 class Test2 {
   constructor ( public a: number = 0){}
 }
// register a singleton Test3
 @singleton()
 class Test3 {
   constructor(public b: number){}
 }
 
 
 // create object
 (factory('test') as Test).a; // 0
 (makeWith(Test1, 9) as Test1).b // 9
````

###### Javascript(es6)
- register(alias = null, constructorParamTypes) It will register a class to the container. The first parameter is the alias of the register class .If the first parameter is a array data , and the second parameter is null or not be pass , the first parameter's value will assign to the second parameter(constructorParamTypes is a array which defined the registered class's constructor parameter types)
- singleton(alias = null, constructorParamTypes) It will register a singleton for a class
- factory(alias) 
- makeWith(alias, ... args) 
````javascript
import {register, singleton, makeWith, factory} from "pretty-ts-container";
@register // same as @register()
 class T1 {
   constructor (  a = 0){this.a = a;}
 }
 @singleton // same as @singleton()
  class T2 {
    constructor (  a = 0){this.a = a;}
  }
// register Test as test, Number is the first parameter's type
@register('test', [Number])
 class Test {
   constructor (  a = 0){
       this.a = a;
   }
 }
 // register Test1
 @register([Number])
 class Test1 {
   constructor(b){ this.b = b;}
 }
 // register a singleton for Test2 , and using `test3` as a alias
 @singleton('test3', [Number])
 class Test2 {
   constructor (a = 0){this.a = a;}
 }
 //
 @singleton([String])
 class Test3 {
   constructor( b){this.b = b;}
 }
 
 
 // 
 (factory('test')).a; // 0
 (makeWith(Test1, 9)).b // 9
````

