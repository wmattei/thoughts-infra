import * as cdk from '@aws-cdk/core';
import Context from '../../wolke/di/decorators/context.decorator';
import Provider from '../../wolke/di/decorators/provider.decorator';
import { DynamoTables } from '../app/database/dynamoTables';

export class ThoughtsInfraStack extends cdk.Stack {
    @Provider()
    public scope: cdk.Stack;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Assign your current instance to the variable that is annotated with the @Provider, 
        // to provide its value to all the properties annotated with @Context
        this.scope = this;

        // You don't have to pass props to your classes because they can inject it through the DI
        new DynamoTables();
    }
}
