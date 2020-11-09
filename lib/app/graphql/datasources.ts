import { IGraphqlApi } from '@aws-cdk/aws-appsync';
import { IFunction } from '@aws-cdk/aws-lambda';
import Context from '../../../wolke/di/decorators/context.decorator';
import Provider from '../../../wolke/di/decorators/provider.decorator';
import { Resources } from '../../types';

export class GraphqlDataSources {
    @Context()
    graphqlApi: IGraphqlApi;

    @Context()
    @Provider()
    public resources: Resources;

    @Context()
    public preSignUrlLambda: IFunction;

    constructor() {
        const thoughts = this.graphqlApi.addDynamoDbDataSource(
            'ThoughtsDataSource',
            this.resources.thoughts.dynamoTable
        );

        const preSignUrls = this.graphqlApi.addLambdaDataSource(
            'PreSignUrlsDataSource',
            this.preSignUrlLambda
        );

        this.resources = {
            ...this.resources,
            thoughts: {
                ...this.resources.thoughts,
                graphqlDataSource: thoughts,
            },
            utils: {
                graphqlDataSource: preSignUrls,
            },
        };
    }
}
