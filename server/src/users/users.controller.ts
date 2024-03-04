import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto, FindAllUsersDto, UpdateUserDto } from "./dto";
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { AuthenticationGuard, Authorization } from "@nestjs-cognito/auth";
import { SystemRoles } from "../common/Auth/UserRoles";

@Controller("users")
@ApiTags("users")
@UseGuards(AuthenticationGuard)
@Authorization({
  allowedGroups: [SystemRoles.ADMIN],
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("create")
  @ApiCreatedResponse({
    description: "The record has been successfully created.",
  })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: "The record has been successfully created.",
  })
  @ApiOperation({ summary: "Create a new user" })
  @ApiConflictResponse({ description: "Record email is taken" })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get("all")
  @ApiOperation({ summary: "Get all users" })
  findAll(@Query() params: FindAllUsersDto) {
    return this.usersService.findAll(params);
  }

  @Patch("update")
  @ApiOperation({ summary: "Update a user" })
  @ApiBody({ type: UpdateUserDto })
  @ApiNotFoundResponse({ description: "Record not found" })
  @ApiOkResponse({ description: "Record updated" })
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete("remove")
  @ApiOperation({ summary: "Remove a user" })
  @ApiNotFoundResponse({ description: "Record not found" })
  @ApiOkResponse({ description: "Record updated" })
  @ApiParam({ name: "id", required: true, description: "User UUID" })
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
