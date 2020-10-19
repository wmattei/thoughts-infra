#!/usr/bin/env node
require('dotenv').config()
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ThoughtsInfraStack } from '../lib/infra/thoughts-infra-stack';

const app = new cdk.App();
new ThoughtsInfraStack(app, 'ThoughtsInfraStack');
