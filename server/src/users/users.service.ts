import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { CreateUserDto, FindAllUsersDto, UpdateUserDto } from "./dto";

import { ConfigService } from "@nestjs/config";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  private readonly cognitoClient: CognitoIdentityProviderClient;

  constructor(private readonly configService: ConfigService) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.configService.get("AWS_REGION"),
    });
  }

  /**
   * The create method is used to create a new user in the Cognito User Pool.
   * @param createUserDto
   * @returns Promise<void>
   *   The create method returns a Promise that resolves to void.
   */
  async create(createUserDto: CreateUserDto) {
    const newUser = new AdminCreateUserCommand({
      Username: createUserDto.email,
      UserPoolId: this.configService.get("COGNITO_USER_POOL_ID"),
      UserAttributes: [
        {
          Name: "email",
          Value: createUserDto.email,
        },
        {
          Name: "family_name",
          Value: createUserDto.familyName,
        },
        {
          Name: "given_name",
          Value: createUserDto.givenName,
        },
        {
          Name: "email_verified",
          Value: "true",
        },
      ],
    });

    try {
      const status = await this.cognitoClient.send(newUser);
      return status.$metadata.httpStatusCode;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.name);
        if (error.name === "UsernameExistsException")
          throw new ConflictException(error.message);
      }
    }
  }

  /**
   * The findAll method is used to retrieve all users from the Cognito User Pool.
   * @param params
   * @returns Promise<User[]>
   */
  async findAll(params: FindAllUsersDto) {
    const getAllUsersCommand = new ListUsersCommand({
      UserPoolId: this.configService.get("COGNITO_USER_POOL_ID"),
      ...params,
    });
    const cognitoResponse = await this.cognitoClient.send(getAllUsersCommand);

    if (cognitoResponse.$metadata.httpStatusCode !== 200)
      throw new InternalServerErrorException();

    return {
      users: cognitoResponse.Users.map((user) =>
        User.fromCognitoUserRequest(user)
      ),
      paginationToken: cognitoResponse.PaginationToken,
    };
  }

  /**
   * The update method is used to update a user in the Cognito User Pool.
   * @param updateUserDto - the data required to update the user
   * @returns a status code indicating the success of the operation
   */
  async update(updateUserDto: UpdateUserDto) {
    const updateUserCommand = new AdminUpdateUserAttributesCommand({
      UserPoolId: this.configService.get("COGNITO_USER_POOL_ID"),
      Username: updateUserDto.email,
      UserAttributes: [
        {
          Name: "family_name",
          Value: updateUserDto.familyName,
        },
        {
          Name: "given_name",
          Value: updateUserDto.givenName,
        },
      ],
    });

    const response = await this.cognitoClient.send(updateUserCommand);

    switch (response.$metadata.httpStatusCode) {
      case 200:
        return HttpStatus.OK;
      case 404:
        return HttpStatus.NOT_FOUND;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Removes user from Cognito User Pool
   * Removes all user files from S3 bucket
   * @param username - the username of the user to remove
   * @returns a message indicating the success of the operation
   */
  async remove(username: string) {
    const removeUserCommand = new AdminDeleteUserCommand({
      UserPoolId: this.configService.get("COGNITO_USER_POOL_ID"),
      Username: username,
    });

    const response = await this.cognitoClient.send(removeUserCommand);

    switch (response.$metadata.httpStatusCode) {
      case 200:
        return HttpStatus.OK;
      case 404:
        return HttpStatus.NOT_FOUND;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
