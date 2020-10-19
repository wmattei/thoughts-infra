
const Injector = {
    register: function (name: string, obj: {}) {
        const t = {} as any;
        t[name] = obj;
        Object.assign(this, t);
    },
    getRegistered: function (key: string): any {
        const that: any = this;
        return that[key];
    },
};

export default Injector;
