import { JsonSchemaType } from '@aws-cdk/aws-apigateway';
import { Endpoint } from '../../../wolke/types';
import { ThoughtsUserEndpoints } from '../../types';

export class UserEndpoints {
    public static endpoints(): ThoughtsUserEndpoints {
        const add: Endpoint = {
            auth: 'cognito',
            handlerPath: 'users/add/index.handler',
            id: 'add_user',
            method: 'POST',
            path: '/users',
            validator: {
                type: JsonSchemaType.OBJECT,
                properties: {
                    name: {
                        type: JsonSchemaType.STRING,
                        description: 'User name',
                    },
                    email: {
                        type: JsonSchemaType.STRING,
                        description: 'User email',
                        pattern: `/\S+@\S+\.\S+/`,
                    },
                    password: {
                        type: JsonSchemaType.STRING,
                        description: 'The user password',
                    },
                },
            },
        };
        return { addUser: add };
    }
}
