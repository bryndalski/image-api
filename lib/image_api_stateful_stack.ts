import { Stack, StackProps, Duration, aws_cognito, CfnParameter } from "aws-cdk-lib";

import type { Construct } from "constructs";
import { UserPool, AccountRecovery, UserPoolEmail } from 'aws-cdk-lib/aws-cognito';
import { SystemRoles } from "../server/src/common/Auth/UserRoles";
import { waitForChangeSet } from "aws-cdk/lib/api/util/cloudformation";


/**
 * ImageApiStatefulStack
 * @class
 * @description This class is responsible for creating the stack for the image api - stateful
 * @extends Stack
 * @constructs
 */
export class Image_api_statefulStack extends Stack  {
  cognito: UserPool;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id,props);
    this.createCognitoUserPool();

    this.createCognitoGroups()
    // this.createCognitoUserRoot()
  }


  private createCognitoUserPool() {
   this.cognito = new UserPool(this, 'ImageApiUserPool', {
      userPoolName: 'ImageApiUserPool',
      selfSignUpEnabled: false,
      signInAliases: {
        email: true
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      autoVerify: { email: true },
      standardAttributes: {
        email: {
          required: true,
          mutable: false
        },
        familyName: {
          required: true,
          mutable: false
        },
        givenName: {
          required: true,
          mutable: false
        },
        profilePicture: {
          required: false,
          mutable: true
        }
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireDigits: true,
        requireUppercase: true,
        requireSymbols: true,
        tempPasswordValidity: Duration.days(7)
      },
      email: UserPoolEmail.withCognito("noreplay@mail.com"),
      userVerification: {
        // TODO: Change this to proper subject
        emailSubject: "Zweryfikuj swoje konto",
        emailStyle: aws_cognito.VerificationEmailStyle.CODE,
        emailBody: "Twój kod weryfikacyjny to: {####}",
      },
      userInvitation: {
        emailSubject: "Account invitation",
        emailBody:
          "Witaj w systemie pictureApi: {username} \nA twoje hasło: {####}",
      },
   })

     const userPoolDomainPrefix = new CfnParameter(
      this,
      "CognitoUserPoolDomainPrefix",
      {
        type: "String",
        description: "Prefix for Cognito user pool domain name",
        default: "image-app-api",
      }
    );

    const userPoolDomain = new aws_cognito.UserPoolDomain(
      this,
      "CognitoUserPoolDomain",
      {
        cognitoDomain: {
          domainPrefix: userPoolDomainPrefix.valueAsString,
        },
        userPool: this.cognito,
      }
    );

    const domains = ["http://localhost:3000"];

    const userPoolClient = new aws_cognito.UserPoolClient(
      this,
      "CognitoUserPoolClient",
      {
        authFlows: {
          userPassword: true,
          userSrp: true,
        },
        disableOAuth: false,
        oAuth: {
          callbackUrls: domains.map((domain) => `${domain}/sign-in/`),
          flows: {
            authorizationCodeGrant: true,
          },
          logoutUrls: domains.map((domain) => `${domain}/sign-out/`),
          scopes: [
            aws_cognito.OAuthScope.EMAIL,
            aws_cognito.OAuthScope.PHONE,
            aws_cognito.OAuthScope.PROFILE,
            aws_cognito.OAuthScope.OPENID,
          ],
        },

        supportedIdentityProviders: [
          aws_cognito.UserPoolClientIdentityProvider.COGNITO,
        ],
        preventUserExistenceErrors: true,
        userPool: this.cognito,
      }

    );
  }

    /**
     * Creates cognito groups
     * @private
     * @description create groups for the application
     * @returns void
     * @memberof Image_api_statefulStack
   */
  private createCognitoGroups() {
    Object.values(SystemRoles).forEach((value) => {
      new aws_cognito.CfnUserPoolGroup(this, value, {
        groupName: value,
        userPoolId: this.cognito.userPoolId,
      });
    });
  }


  /**
   * Creates root user for the application
   * @private
   * @description create root user with email `kubabryndal@gmail.com` and assign him to `ADMIN` group
   * @returns void
   * @memberof Image_api_statefulStack
   */
  private createCognitoUserRoot() {
   const user =  new aws_cognito.CfnUserPoolUser(this, "CreateUserRoot", {
      userPoolId: this.cognito.userPoolId,
      userAttributes: [
        {
          name: "family_name",
          value: "Bryndal",
        },
        {
          name: "given_name",
          value: "Jakub",
        },
        {
          name:"email_verified",
          value: "True"
        },
        {
          name: "email",
          value: "kubabryndal@gmail.com"
        },
        {
          name:"profile_picture",
          value:"https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"
        }
      ],
    })
    //TODO fix this
    new aws_cognito.CfnUserPoolUserToGroupAttachment(this, "AddUserToGroup", {
      userPoolId: this.cognito.userPoolId,
      groupName: SystemRoles.ADMIN,
      username: user.username!,
    });
  }
}