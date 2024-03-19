#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ImageApiStatefulStack } from "../lib/image_api_stateful_stack";
import { Bucket_stack } from "../lib/bucket_stack";
import { ImageApiBackendStack } from "../lib/backend_stack";
import { ImageApiVpcStack } from "../lib/vpc_stack";


const app = new cdk.App();

const { cognito, cognitoClient } = new ImageApiStatefulStack(app, "ImageApiStatefulStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
});

new Bucket_stack(app, "ImageApiBucketStack", {
  cognito, env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
});

if (process.env.NODE_ENV === "production") {
  const { vpc } = new ImageApiVpcStack(app, "ImageApiVpc", {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION
    }
  });
  new ImageApiBackendStack(app, "ImageApiBackendStack", {
    cognitoUserPool: cognito,
    cognitoUserPoolClient: cognitoClient,
    vpc,
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION
    }
  });

}



