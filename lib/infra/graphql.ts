import {
    AuthorizationType,
    GraphqlApi,
    IGraphqlApi,
    Schema,
} from '@aws-cdk/aws-appsync';
import { IUserPool } from '@aws-cdk/aws-cognito';
import { Stack } from '@aws-cdk/core';
import { join } from 'path';
import Context from '../../wolke/di/decorators/context.decorator';
import Provider from '../../wolke/di/decorators/provider.decorator';
import { Consts } from '../consts';

export class Graphql {
    @Context()
    scope: Stack;

    @Context()
    cognitoUserPool: IUserPool;

    @Provider()
    graphqlApi: IGraphqlApi;

    constructor() {
        this.graphqlApi = new GraphqlApi(this.scope, Consts.GRAPHQL_API_NAME, {
            name: Consts.GRAPHQL_API_NAME,
            schema: Schema.fromAsset(
                join(__dirname, '../app/graphql/schema.graphql')
            ),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: AuthorizationType.USER_POOL,
                    userPoolConfig: {
                        userPool: this.cognitoUserPool,
                    },
                },
            },
            xrayEnabled: true,
        });
    }
}
