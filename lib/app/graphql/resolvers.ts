import { MappingTemplate, PrimaryKey, Values } from '@aws-cdk/aws-appsync';
import Context from '../../../wolke/di/decorators/context.decorator';
import { Resources } from '../../types';

export class GraphqlResolvers {
    @Context()
    public resources: Resources;

    constructor() {
        this.resources.thoughts.graphqlDataSource?.createResolver({
            typeName: 'Query',
            fieldName: 'thoughts',
            requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
            responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
        });

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

        // this.resources = this.resources; // TODO fix this somehow
    }
}
