// import { aws_ec2, Stack, StackProps } from "aws-cdk-lib";
// import { Construct } from "constructs";
// import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
// import { Secret } from "aws-cdk-lib/aws-secretsmanager";
// import { ApplicationLoadBalancedEc2Service } from "aws-cdk-lib/aws-ecs-patterns";
// import { Cluster, ContainerImage } from "aws-cdk-lib/aws-ecs";
// import { join } from "path";
// import { Platform } from "aws-cdk-lib/aws-ecr-assets";
// export class ImageApiBackendStack extends Stack {
//
//   loadBalancedBackend: ApplicationLoadBalancedEc2Service;
//   cluster: Cluster;
//
//   constructor(scope: Construct, id: string, props?: ImageApiBackendStackProps) {
//     super(scope, id, props);
//
//     this.createECSCluster(props?.vpc!);
//     this.createECSService(props!.cognitoUserPool, props!.cognitoUserPoolClient);
//   }
//
//   private createECSCluster(vpc: aws_ec2.Vpc) {
//     this.cluster = new Cluster(this, "ImageApiCluster", {
//       vpc
//     });
//
//     this.cluster.addCapacity("DefaultAutoScalingGroup", {
//       maxCapacity: 1,
//       instanceType: new InstanceType("t3.micro")
//     });
//   }
//
//   /**
//    * Creates the ECS service
//    * @param cognitoUserPool - The Cognito User Pool
//    * @param cognitoUserPoolClient - The Cognito User Pool Client
//    * @private
//    */
//   private createECSService(
//     cognitoUserPool: UserPool,
//     cognitoUserPoolClient: UserPoolClient
//   ) {
//     const secret = Secret.fromSecretNameV2(
//       "ImageApiSecrets"
//     );
//
//     this.loadBalancedBackend =
//       new ApplicationLoadBalancedEc2Service(
//         this,
//         "LoadBalancedImageApi",
//         {
//               //   secret,
//               //   "DATABASE_URL"
//               // )
//             },
//             environment: {
//               COGNITO_USER_POOL_ID: cognitoUserPool.userPoolId,
//               COGNITO_CLIENT_ID: cognitoUserPoolClient.userPoolClientId
//             },
//             image: ContainerImage.fromAsset(
//               join(__dirname, "../server"),
//               {
//                 platform: Platform.LINUX_ARM64
//               }
//             )
//           },
//           publicLoadBalancer: true
//         }
//       );
//   }
// }
//       this,
//       "DatabaseSecret",
//           cluster: this.cluster,
//           memoryLimitMiB: 1024,
//           taskImageOptions: {
//             containerPort: 3000,
//             secrets: {
//               // DATABASE_URL: aws_ecs.Secret.fromSecretsManager(
//               NODE_ENV: "production",
//
// import { InstanceType, Vpc } from "aws-cdk-lib/aws-ec2";
//
// interface ImageApiBackendStackProps extends StackProps {
//   cognitoUserPool: UserPool;
//   cognitoUserPoolClient: UserPoolClient;
//   vpc?: Vpc;
// }

import * as cdk from "aws-cdk-lib";

import type { Construct } from "constructs";

import type * as aws_cognito from "aws-cdk-lib/aws-cognito";
import * as aws_ec2 from "aws-cdk-lib/aws-ec2";
import * as aws_ecs from "aws-cdk-lib/aws-ecs";
import * as aws_ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import * as aws_ecr_assets from "aws-cdk-lib/aws-ecr-assets";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";

import { join } from "path";

interface ImageApiBackendStackProps extends cdk.StackProps {
  cognitoUserPool: aws_cognito.UserPool;
  cognitoUserPoolClient: aws_cognito.UserPoolClient;
  vpc?: aws_ec2.Vpc;
}

export class ImageApiBackendStack extends cdk.Stack {
  loadBalancedBackend: aws_ecs_patterns.ApplicationLoadBalancedEc2Service;
  cluster: aws_ecs.Cluster;

  constructor(
    scope: Construct,
    id: string,
    {
      cognitoUserPool,
      cognitoUserPoolClient,
      vpc,
      ...props
    }: ImageApiBackendStackProps
  ) {
    super(scope, id, props);

    this.createECSCluster(vpc!);
    this.createECSService(
      cognitoUserPool,
      cognitoUserPoolClient
    );
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private createECSCluster(vpc: aws_ec2.Vpc) {
    this.cluster = new aws_ecs.Cluster(this, "ImageApiCluster", {
      vpc
    });

    this.cluster.addCapacity("DefaultAutoScalingGroup", {
      maxCapacity: 1,
      instanceType: new aws_ec2.InstanceType("t3.small")
    });
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private createECSService(
    cognitoUserPool: aws_cognito.UserPool,
    cognitoUserPoolClient: aws_cognito.UserPoolClient
  ) {
    const secret = Secret.fromSecretNameV2(
      this,
      "createECSServiceImportedSecret",
      "ImageApiSecrets"
    );

    this.loadBalancedBackend =
      new aws_ecs_patterns.ApplicationLoadBalancedEc2Service(
        this,
        "LoadBalancedBackend",
        {
          cluster: this.cluster,
          memoryLimitMiB: 1024,

          taskImageOptions: {
            containerPort: 5000,
            secrets: {
              NEO4J_HOST: aws_ecs.Secret.fromSecretsManager(
                secret,
                "DATABASE_URL"
              )
            },
            environment: {
              NODE_ENV: "production",
              COGNITO_USER_POOL_ID: cognitoUserPool.userPoolId,
              COGNITO_CLIENT_ID: cognitoUserPoolClient.userPoolClientId
            },
            image: aws_ecs.ContainerImage.fromAsset(
              join(__dirname, "../server"),
              {
                platform: aws_ecr_assets.Platform.LINUX_ARM64
              }
            )
          },
          publicLoadBalancer: true
        }
      );

  }
}