# Experimental features:

## Deno 🤷‍♂️

All of the lambdas in this POC are done using Deno. The main reason here is **Typescript**.
I could use typescript to code and then build it to javascript before uploading, but this would add one more step to the delivery process, when i'd rather just run `cdk deploy`. Even in the codebuild, I'd still need a set of dependencies just to build a simple typescript lambda.

The lambdas in this project use a custom runtime as a layer, and every lambda function uses this layer

The layer is basically the latest version of [deno-lambda](https://github.com/hayd/deno-lambda/releases).

The advantages are:

-   Deno doesn't need a `node_modules` as it doesn't need a package manager, it manages its own packages and caches them the first time you run a deno code
-   With deno one single file can do whatever you want to do, no need of dependencies, which means you don't need to store the lambda in a s3 bucket and reference it using `Code.fromBucket`, you just have to create the lambda function in your project and reference it using `Code.fromAsset`.

> No builds, no zips, no buckets...

Example:

```typescript
// lambdas.ts (ran by cdk)
new Function(this.scope, Consts.LAMBDAS_NAMES.UTILS.PRESIGN_URLS, {
    code: Code.fromAsset(Consts.RESOURCE_PATH + '/lambdas/utils/presign-url'),
    handler: 'index.handler',
    runtime: Runtime.PROVIDED,
    layers: [this.denoLayer],
});
```

```typescript
// /resources/lambdas/utils/presign-url/index.ts (My lambda)
import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Context,
} from 'https://deno.land/x/lambda/mod.ts';

export async function handler(
    event: APIGatewayProxyEvent,
    context: Context
): Promise<any> {
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/json' },
        body: 'It works',
    };
}
```

## AppSync + GraphQL

AWS app sync isn't new, even though it's still an experimental feature.

This project uses AWS app sync with the schema first approach, that means that we do have a `schema.graphql` file.

When working with app sync, you'll need datasource and resolvers

### Datasource

`Datasource` is the place from where your data comes (queries) and to where it goes to (mutations). It could be `DynamoDB` table, a http request, or a lambda function

Example:
```typescript
const thoughts = this.graphqlApi.addDynamoDbDataSource(
    'ThoughtsDataSource',
    this.resources.thoughts.dynamoTable
);
```

### Resolvers

Resolvers is where the business logics happens, it's where you transform the data coming from a query or mutation to the data that your datasource expects.

#### Built-in mapping templates
When the purpose of a query is to simple fetch data from a DynamoDB table, you can use the built-in MappingTemplates that AppSync provides: 
Example:

```typescript
this.resources.thoughts.graphqlDataSource?.createResolver({
    typeName: 'Query',
    fieldName: 'thoughts',
    requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
    responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
});
```

Here we are saying that this resolver is for a GraphQL query, and the field name is `thoughts`, the request mapping template is a built-in dynamoDbScan template, which means that the query will be transformed to a dynamoDb scan request, the same happens with the result, it will be transformed from a dynamoDb Result list

#### VTL
When the data that you want to send or receive from your datasource need some logic on its transformation you may want to use VTL (Velocity Template Language); 
It allows you to create logic such as conditions and use context variables that come from the query, the identity provided by Cognito or IAM, or even date or JSON utils:

Example:
```typescript
 this.resources.thoughts.graphqlDataSource?.createResolver({
    typeName: 'Mutation',
    fieldName: 'addThought',
    requestMappingTemplate: MappingTemplate.fromString(`
        {
            "version" : "2017-02-28",
            "operation" : "PutItem",
            "key": {
                "ID": {"S": "$util.autoId()"}
            },
            "attributeValues": $util.dynamodb.toMapValuesJson({
                "content": $ctx.arguments.content,
                "author": $ctx.identity.username
            }),
        }
    `),
    responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
});
```

This is a mutation to add a new thought to the database, as you can see the responseMappingTemplate is the same as the above one, we are just mapping the dynamoDb ResultItem to a json

What does differ from the above one is the requestMappingTemplate, that instead of using something ready, we are creating our own, by providing a string (it could be a file).

In this example we are sending to the datasource the data transformed, where the ID is a random UUID provided by `$util.autoId()`, and on the attributeValues, we are setting the `author`with the cognito authenticated username

### Realtime
AWS AppSync makes it really easy to have GraphQL subscriptions.
By simply adding this snippet:
```graphql
type Subscription {
    thoughtAdded: Thought
    @aws_subscribe(mutations: ["addThought"])
}
```

i am saying that there should be a subscription available that will fire every time a thought is added.
This can be subscribed by your frontend and you'll magically have real-time data

## Dependency injector

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
