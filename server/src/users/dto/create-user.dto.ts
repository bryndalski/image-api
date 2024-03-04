import { User } from "../entities/user.entity";
import { OmitType } from "@nestjs/swagger";

/**
 * The CreateUserDto class is a data transfer object that is used to define the shape of the data that is required to create a new user.
 */
export class CreateUserDto extends OmitType(User, ["id"]) {}
