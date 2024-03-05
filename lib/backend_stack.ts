import { aws_ec2, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { ApplicationLoadBalancedEc2Service } from "aws-cdk-lib/aws-ecs-patterns";
import { Cluster, ContainerImage } from "aws-cdk-lib/aws-ecs";
import { join } from "path";
import { Platform } from "aws-cdk-lib/aws-ecr-assets";
import { InstanceType, Vpc } from "aws-cdk-lib/aws-ec2";

interface ImageApiBackendStackProps extends StackProps {
  cognitoUserPool: UserPool;
  cognitoUserPoolClient: UserPoolClient;
  vpc?: Vpc;
}

export class ImageApiBackendStack extends Stack {

  loadBalancedBackend: ApplicationLoadBalancedEc2Service;
  cluster: Cluster;

  constructor(scope: Construct, id: string, props?: ImageApiBackendStackProps) {
    super(scope, id, props);

    this.createECSCluster(props?.vpc!);
    this.createECSService(props!.cognitoUserPool, props!.cognitoUserPoolClient);
  }

  private createECSCluster(vpc: aws_ec2.Vpc) {
    this.cluster = new Cluster(this, "ImageApiCluster", {
      vpc
    });

    this.cluster.addCapacity("DefaultAutoScalingGroup", {
      maxCapacity: 1,
      instanceType: new InstanceType("t3.small")
    });
  }

  /**
   * Creates the ECS service
   * @param cognitoUserPool - The Cognito User Pool
   * @param cognitoUserPoolClient - The Cognito User Pool Client
   * @private
   */
  private createECSService(
    cognitoUserPool: UserPool,
    cognitoUserPoolClient: UserPoolClient
  ) {
    const secret = Secret.fromSecretNameV2(
      this,
      "DatabaseSecret",
      "ImageApiSecrets"
    );

    this.loadBalancedBackend =
      new ApplicationLoadBalancedEc2Service(
        this,
        "LoadBalancedImageApi",
        {
          cluster: this.cluster,
          memoryLimitMiB: 1024,
          taskImageOptions: {
            containerPort: 3000,
            secrets: {
              // DATABASE_URL: aws_ecs.Secret.fromSecretsManager(
              //   secret,
              //   "DATABASE_URL"
              // )
            },
            environment: {
              NODE_ENV: "production",
              COGNITO_USER_POOL_ID: cognitoUserPool.userPoolId,
              COGNITO_CLIENT_ID: cognitoUserPoolClient.userPoolClientId
            },
            image: ContainerImage.fromAsset(
              join(__dirname, "../server"),
              {
                platform: Platform.LINUX_ARM64
              }
            )
          },
          publicLoadBalancer: true
        }
      );
  }
}