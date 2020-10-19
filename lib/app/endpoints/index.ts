import { JsonSchemaType } from '@aws-cdk/aws-apigateway';
import Provider from '../../../wolke/di/decorators/provider.decorator';
import { Endpoint } from '../../../wolke/types';
import { ThoughtsUserEndpoints } from '../../types';
import { UserEndpoints } from './users';

export class ThoughtsEndpoints {
    @Provider()
    public endpoints: { user: ThoughtsUserEndpoints };

    constructor() {
        this.endpoints = {
            user: UserEndpoints.endpoints(),
        };
    }
}
