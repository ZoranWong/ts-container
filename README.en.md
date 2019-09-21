### [pretty-ts-container](https://www.npmjs.com/package/pretty-ts-container) is a container which can makes classes and objects to be organized and managed easier, and which provides a decorator-style IOC for programming.And also all classes finally will be registered into a global object (which is a 
Container type constant.).
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
- register(alias = null, constructorParamTypes) 将一个类注册到容器内, alias别名，不填写第一个参数为数组时其值会赋给constructorParamTypes(构造函数参数类型数组，定义构造函数参数类型),constructorParamTypes数组类型
- singleton(alias = null, constructorParamTypes) 将一个类型注册成为单例， alias别名，不填写第一个参数为数组时其值会赋给constructorParamTypes(构造函数参数类型数组，定义构造函数参数类型)constructorParamTypes数组类型
- factory(alias: string|T) 通过别名或者类获取注册的对象
- makeWith(alias: string|T, ... args: any[]) 通过别名或者类型获取注册对象，同时可以想构造函数提供参数，单例模式只有在系统第一次获取对象时才会调用构造函数，所以可以把单例模式对象在系统启动时提供参数完成对象创建
````javascript
import {register, singleton, makeWith, factory} from "pretty-ts-container";
@register // @register()一样的效果
 class T1 {
   constructor (  a = 0){this.a = a;}
 }
 @singleton // @singleton()一样的效果
  class T2 {
    constructor (  a = 0){this.a = a;}
  }
// 注册Test类，Test将拥有别名的
@register('test', [Number])
 class Test {
   constructor (  a = 0){
       this.a = a;
   }
 }
 // 注册Test1类，没有别名
 @register([Number])
 class Test1 {
   constructor(b){ this.b = b;}
 }
 // 注册Test3类，Test3将拥有别名的
 @singleton('test3', [Number])
 class Test2 {
   constructor (a = 0){this.a = a;}
 }
 // 注册Test3类单例，没有别名
 @singleton([String])
 class Test3 {
   constructor( b){this.b = b;}
 }
 
 
 // 获取注册对象
 (factory('test')).a; // 0
 (makeWith(Test1, 9)).b // 9
````

