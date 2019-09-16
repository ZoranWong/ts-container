let container = new Map();

class A {
    log() {
        console.log('container log');
    }
}

class P {
    log() {
        console.log('container log');
    }
}

container.set(A, new A);
console.log(A.toString() === P.toString());
console.log(container.get(A).log());
