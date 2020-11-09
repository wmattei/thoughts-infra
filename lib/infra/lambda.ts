import {
    Code,
    Function,
    IFunction,
    ILayerVersion,
    Runtime,
} from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import Context from '../../wolke/di/decorators/context.decorator';
import Provider from '../../wolke/di/decorators/provider.decorator';
import { Consts } from '../consts';

export class Lambda {
    @Context()
    public scope: Stack;

    @Provider()
    public preSignUrlLambda: IFunction;

    @Context()
    public denoLayer: ILayerVersion;

    constructor() {
        // TODO read from resources folder and create all the lambdas founded there

        this.preSignUrlLambda = new Function(
            this.scope,
            Consts.LAMBDAS_NAMES.UTILS.PRESIGN_URLS,
            {
                code: Code.fromAsset(
                    Consts.RESOURCE_PATH + '/lambdas/utils/presign-url'
                ),
                handler: 'index.handler',
                runtime: Runtime.PROVIDED,
                layers: [this.denoLayer],
            }
        );
    }
}
