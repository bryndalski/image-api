import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

/**
 * The UpdateUserDto class is a data transfer object that is used to define the shape of the data that is required to update an existing user.
 */
export class UpdateUserDto extends PickType(CreateUserDto, [
  "familyName",
  "givenName",
  "email",
]) {}
