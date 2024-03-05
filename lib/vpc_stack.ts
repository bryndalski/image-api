import * as cdk from "aws-cdk-lib";

import type { Construct } from "constructs";

import { Vpc } from "aws-cdk-lib/aws-ec2";

export class ECPSVpcStack extends cdk.Stack {
  vpc: Vpc;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.createVPC();
  }

  /**
   * Creates VPC used in the project
   * @private
   */
  private createVPC() {
    this.vpc = new Vpc(this, "MainVPC", {
      enableDnsHostnames: true,
      enableDnsSupport: true,
      maxAzs: 3,
      natGateways: 1
    });
  }
}