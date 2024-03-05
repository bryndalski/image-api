import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CognitoAuthModule } from "@nestjs-cognito/auth";
import { HealthModule } from "./health/health.module";
import { ImagesModule } from "./images/images.module";
import { FileManagerModule } from "./file-manager/file-manager.module";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CognitoAuthModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        jwtVerifier: {
          userPoolId: configService.get("COGNITO_USER_POOL_ID") as string,
          clientId: configService.get("COGNITO_CLIENT_ID"),
          tokenUse: "id",
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: "mongodb",
        url: configService.get("MONGODB_URI"),
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    ImagesModule,
    FileManagerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
