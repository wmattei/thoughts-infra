import * as cdk from '@aws-cdk/core';
import Provider from '../../wolke/di/decorators/provider.decorator';
import { DynamoTables } from '../app/database/dynamoTables';
import { GraphqlDataSources } from '../app/graphql/datasources';
import { GraphqlResolvers } from '../app/graphql/resolvers';
import { Cognito } from './cognito';
import { Graphql } from './graphql';
import { Lambda } from './lambda';
import { TypescriptRuntime } from './typescript-runtime';

export class ThoughtsInfraStack extends cdk.Stack {
    @Provider()
    public scope: cdk.Stack;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        this.scope = this;

        // Creates a typescript runtime that allows us to run deno code on lambda
        new TypescriptRuntime();
        new Lambda();

        new Cognito();

        new DynamoTables();
        new Graphql();
        new GraphqlDataSources();
        new GraphqlResolvers();
    }
}
