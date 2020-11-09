import {
    IUserPool,
    UserPool,
    VerificationEmailStyle,
} from '@aws-cdk/aws-cognito';
import { Stack } from '@aws-cdk/core';
import Context from '../../wolke/di/decorators/context.decorator';
import Provider from '../../wolke/di/decorators/provider.decorator';
import { Consts } from '../consts';

export class Cognito {
    @Provider()
    cognitoUserPool: IUserPool;

    @Context()
    scope: any;

    constructor() {
        const pool = new UserPool(this.scope, Consts.COGNITO_POOL_NAME, {
            userPoolName: Consts.COGNITO_POOL_NAME,
            selfSignUpEnabled: true,
            userVerification: {
                emailSubject: 'Welcome to thoughts',
                emailBody:
                    'Hello there, Thanks for signing up to our awesome app! Your verification code is {####}',
                emailStyle: VerificationEmailStyle.CODE,
            },
            standardAttributes: {
                email: {
                    required: true,
                    mutable: true,
                },
            },
            signInAliases: {
                email: true,
                username: true,
            },
            passwordPolicy: {
                minLength: 6,
            },
            autoVerify: { email: true },
        });

        pool.addClient('UserClient', {
            preventUserExistenceErrors: true,
        });

        pool.addDomain('CognitoDomain', {
            cognitoDomain: {
                domainPrefix: Consts.DOMAIN_PREFIX,
            },
        });

        this.cognitoUserPool = pool;
    }
}
