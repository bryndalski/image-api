import { IsEmail, IsString, IsUUID, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ListUsersCommandOutput } from "@aws-sdk/client-cognito-identity-provider";

export class User {
  @IsUUID()
  @ApiProperty({
    description: "The id of the user",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  readonly id: string;

  @IsEmail()
  @ApiProperty({
    description: "The email of the user",
    type: String,
    required: true,
    example: "johnDoe@mail.com",
  })
  email: string;

  @ApiProperty({
    description: "The given name of the user",
    type: String,
    required: true,
    example: "John",
    maximum: 50,
  })
  @IsString()
  @MaxLength(50)
  givenName: string;

  @ApiProperty({
    description: "The family name of the user",
    type: String,
    required: true,
    example: "Doe",
    maximum: 50,
  })
  @IsString()
  @MaxLength(50)
  familyName: string;

  static fromCognitoUserRequest(
    cognitoUser: ListUsersCommandOutput["Users"][0]
  ): User {
    return {
      id: cognitoUser[0].Username,
      email: cognitoUser[0].Attributes.find((attr) => attr.Name === "email")
        .Value,
      givenName: cognitoUser[0].Attributes.find(
        (attr) => attr.Name === "given_name"
      ).Value,
      familyName: cognitoUser[0].Attributes.find(
        (attr) => attr.Name === "family_name"
      ).Value,
    };
  }
}
