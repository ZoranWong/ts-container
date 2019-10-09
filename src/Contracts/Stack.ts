"use strict";
import {end} from "../Utils/array";

export default class Stack {
    private _list: any[];
    private _size: number = 0;

    public push (value: any) {
        this._list.push(value);
        this._size++;
    }

    public pop () {
        this._size--;
        return this._list.pop();
    }

    public end () {
        return end(this._list)
    }

    public join (s: string) {
        return this._list.join(s);
    }
}
