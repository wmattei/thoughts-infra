import Injector from '../injector';

function Provider() {
    return function (target: any, key: string) {
        let val = Injector;

        const getter = function () {
            return val;
        };
        const setter = (val: any) => {
            Injector.register(key, val);
        };

        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        });
    };
}

export default Provider;
