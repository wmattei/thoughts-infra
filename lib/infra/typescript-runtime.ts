import {
    Code,
    ILayerVersion,
    LayerVersion,
    Runtime,
} from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import Context from '../../wolke/di/decorators/context.decorator';
import Provider from '../../wolke/di/decorators/provider.decorator';
import { Consts } from '../consts';

export class TypescriptRuntime {
    @Context()
    public scope: Stack;

    @Provider()
    public denoLayer: ILayerVersion;

    constructor() {
        this.denoLayer = new LayerVersion(this.scope, 'deno-layer', {
            code: Code.fromAsset(`${Consts.RESOURCE_PATH}/deno-layer`),
            compatibleRuntimes: [Runtime.PROVIDED],
            description: 'A layer that enables DENO to run in AWS Lambda',
        });
    }
}
