import Container from './Container';
import "reflect-metadata";
/**
 * 容器对象
 * @var
 * @type {Container} container
* */
export declare const container: Container;
/**
 * 将class（target）注册到容器中
 * @param {String} name 别名默认没有
 * @param {Array<any>} constructorParamTypes 注册类型的构造函数参数类型（js版本使用），默认为null
 * @return {any}
 * */
export declare function register(name?: any, constructorParamTypes?: Array<any>): any;
/**
 * 为class（target）注册单例对象
 * @param {String|Ctor<T>} name 别名默认没有
 * @param {Array<any>} constructorParamTypes 注册类型的构造函数参数类型（js版本使用），默认为null
 * @return {any}
 * */
export declare function singleton(name?: any, constructorParamTypes?: Array<any>): any;
/**
 * 工厂方法获取（创建）name对应的对象实例
 * @param {String| T} name 类型或者别名
 * @return T
* */
export declare function factory<T>(name: any): T;
/**
 * 工厂方法获取（创建）name对应的对象实例
 * @param {String| T} name 类型或者别名
 * @param {any[]} args 构造函数参数
 * @return T
 * */
export declare function makeWith<T>(name: any, ...args: any[]): T;
