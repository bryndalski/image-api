#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Image_api_statefulStack } from "../lib/image_api_stateful_stack";
import { Bucket_stack } from "../lib/bucket_stack";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { ImageApiBackendStack } from "../lib/backend_stack";


const app = new cdk.App();

const { cognito, cognitoClient } = new Image_api_statefulStack(app, "ImageApiStatefulStack", {
  env: {
    region: "eu-central-1"
  }
});

new Bucket_stack(app, "ImageApiBucketStack", { cognito });

const vpc = process.env.NODE_ENV === "production" ? new Vpc(app, "ImageApiVpc") : undefined;

new ImageApiBackendStack(app, "ImageApiBackendStack", {
  cognitoUserPool: cognito,
  cognitoUserPoolClient: cognitoClient,
  vpc,
  env: {
    region: "eu-central-1"
  }
});
