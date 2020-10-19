import Injector from '../injector';

type Props = {
    verbose: boolean;
};

const defaultValue = { verbose: false }
function Context({ verbose }: Props = defaultValue) {
    return function (target: any, key: string) {
        let val = Injector;

        const getter = function () {
            const that: any = val;
            if (verbose) return that;
            return that[key];
        };

        Object.defineProperty(target, key, {
            get: getter,
            enumerable: true,
            configurable: true,
        });
    };
}

export default Context;
