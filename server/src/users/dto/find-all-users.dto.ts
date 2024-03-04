import type { ListUsersRequest } from "@aws-sdk/client-cognito-identity-provider";
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

/**
 * The FindAllUsersDto class is a data transfer object
 * used to define the shape of the data that is required
 * to find all users in the Cognito User Pool.
 */
export class FindAllUsersDto
  implements Pick<ListUsersRequest, "Limit" | "PaginationToken">
{
  @IsNumber()
  @Max(60)
  @Min(1)
  @ApiPropertyOptional({
    description: "The maximum number of users to return",
    default: 60,
  })
  Limit: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: "The token to continue the search",
  })
  PaginationToken: string;
}

export class FindAllUsersResponseDto {
  @ApiProperty({
    type: () => User,
    isArray: true,
    description: "The list of users",
  })
  users: User[];

  @ApiProperty({
    description: "The token to continue the search",
  })
  paginationToken: string;
}
