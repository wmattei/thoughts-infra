import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';
import Context from '../../../wolke/di/decorators/context.decorator';
import Provider from '../../../wolke/di/decorators/provider.decorator';
import { Consts } from '../../consts';
import { Resources } from '../../types';

export class DynamoTables {
    @Context()
    public scope: cdk.Stack;

    @Provider()
    public resources: Resources;

    constructor() {
        const thoughtsTable = new Table(this.scope, 'Thoughts', {
            partitionKey: { name: 'ID', type: AttributeType.STRING },
            tableName: Consts.TABLE_NAMES.thoughts,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        this.resources = {
            thoughts: { dynamoTable: thoughtsTable },
        };
    }
}
