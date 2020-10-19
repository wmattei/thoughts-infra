import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';
import Context from '../../../wolke/di/decorators/context.decorator';
import Provider from '../../../wolke/di/decorators/provider.decorator';
import { Consts } from '../../consts';
import { ThoughtsTables } from '../../types';

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

        const thoughtsTable = new Table(this.scope, 'Thoughts', {
            partitionKey: { name: 'ID', type: AttributeType.STRING },
            tableName: Consts.TABLE_NAMES.thoughts,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        this.tables = {
            users: userTable,
            thoughts: thoughtsTable,
        };
    }
}
