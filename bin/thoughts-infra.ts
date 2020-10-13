#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ThoughtsInfraStack } from '../lib/thoughts-infra-stack';

const app = new cdk.App();
new ThoughtsInfraStack(app, 'ThoughtsInfraStack');
