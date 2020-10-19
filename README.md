## Experimental features:

### Dependency injector

This infra is built using the simplest dependency injector approach. There is one Singleton that can be called a `container`, which is basically a constant with `register` methods that update its own value:

```typescript
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
```

To make the developer life easier i created two decorators:

#### @Provider and @Context

Every single class property decorated with `@Provider` will inject its value to the DI every time the value its set, eg.

```typescript
export class ThoughtsInfraStack extends cdk.Stack {
    @Provider()
    public scope: cdk.Stack;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // This injects "scope" to the DI
        this.scope = this;

        new DynamoTables();
    }
}
```

In this example, once i have my instance of the stack instantiated i provide its value to my Injector, so others classes that need this scope to create AWS services do not need to receive it as props, once they can inject it, eg:

```typescript
export class DynamoTables {
    @Context()
    public scope: cdk.Stack;

    @Provider()
    public tables: ThoughtsTables;

    constructor() {
        const userTable = new Table(this.scope, 'Users', {
            partitionKey: { name: 'ID', type: AttributeType.STRING },
            tableName: Consts.TABLE_NAMES.users,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        this.tables = {
            thoughts: thoughtsTable,
        };
    }
}
```

In this scenario i am creating a table on DynamoDB, which requires a scope as the first parameter, usually you would extend the class to `cdk.Construct` and pass `this` as scope, which would also require you to receive properties through the props of the constructor.
With DI this is not necessary anymore, as you can just use a attribute decorated with `Context` to access everything that has previously been provided by the `@Provider` decorator

> Every assignment made to a attribute decorated with `@Provider` will be accessible to every attribute decorated with `@Context`

By default, the `@Context` will lookup in the Injector object for the value that matches the key of the property, for example:

```typescript
@Context()
public scope: cdk.Stack;
```

In this scenario, as the attribute key is `scope` it will search for a `scope` within the Injector object.

If you want to inject the whole Injector object on one variable you can use the option `verbose: true`. eg:

```typescript
@Context({ verbose: true })
public context: any;
```

In this case, `context` will receive everything that has ever been **provided**, and the attribute key is not important anymore.
