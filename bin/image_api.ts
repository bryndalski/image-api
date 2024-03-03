#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Image_api_statefulStack } from '../lib/image_api_stateful_stack';


const app = new cdk.App();

new Image_api_statefulStack(app, 'ImageApiStatefulStack',{
  env:{
    region:"eu-central-1",
  }
})

